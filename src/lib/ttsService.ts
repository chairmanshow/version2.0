/**
 * Chotelal Ji Health - Cloudflare Edge TTS Service
 * Voice: hi-IN-MadhurNeural (Warm, energetic, Indian Hindi male tone)
 * Rate: +10% (Fast, natural speaking pace)
 * Pitch: -2Hz (Warm, dignified Ayurvedic Vaidya tone)
 */

import { fetchWithFallback } from './api-config';

let isSpeaking = false;
let voiceQueue: string[] = [];
let currentAudio: HTMLAudioElement | null = null;
let isMuted = false;
let onSpeakingChangeListeners: Array<(speaking: boolean) => void> = [];

function notifySpeakingChange(speaking: boolean) {
  isSpeaking = speaking;
  onSpeakingChangeListeners.forEach((fn) => {
    try {
      fn(speaking);
    } catch (e) {
      console.warn('Listener error:', e);
    }
  });
}

export function subscribeSpeakingStatus(listener: (speaking: boolean) => void): () => void {
  onSpeakingChangeListeners.push(listener);
  listener(isSpeaking);
  return () => {
    onSpeakingChangeListeners = onSpeakingChangeListeners.filter((l) => l !== listener);
  };
}

export function isAudioMuted(): boolean {
  return isMuted;
}

export function setAudioMuted(muted: boolean): void {
  isMuted = muted;
  if (muted) {
    stopSpeaking();
  }
}

export function toggleAudioMuted(): boolean {
  setAudioMuted(!isMuted);
  return isMuted;
}

/**
 * Cleanly stops any ongoing audio playback and empties the voice queue
 */
export function stopSpeaking(): void {
  voiceQueue = [];
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (e) {}
    currentAudio = null;
  }
  notifySpeakingChange(false);
}

/**
 * Enqueues text to speak in Chotelal Ji's voice (hi-IN-MadhurNeural)
 */
export async function speak(text: string): Promise<void> {
  if (!text || !text.trim() || isMuted) return;

  // Clean markdown / emoji / asterisks for smooth TTS pronunciation
  const cleanText = text
    .replace(/[*_#`~\[\]\(\)]/g, ' ')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanText) return;

  if (isSpeaking) {
    voiceQueue.push(cleanText);
    return;
  }

  notifySpeakingChange(true);

  try {
    let audioBlob: Blob | null = null;

    // 1. Try server neural TTS endpoint
    try {
      const response = await fetchWithFallback('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cleanText,
          voice: 'hi-IN-MadhurNeural',
          rate: '+10%',
          pitch: '-2Hz',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.audioBase64) {
          const byteCharacters = atob(data.audioBase64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          audioBlob = new Blob([byteArray], { type: data.mimeType || 'audio/mpeg' });
        }
      }
    } catch (edgeErr) {
      console.warn('Neural TTS synthesis note:', edgeErr);
    }

    if (!audioBlob) {
      // 2. Graceful fallback to browser Web Speech API SpeechSynthesis
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'hi-IN';
        utterance.rate = 1.05;
        const voices = window.speechSynthesis.getVoices();
        const hiVoice = voices.find((v) => v.lang.includes('hi') || v.lang.includes('IN'));
        if (hiVoice) utterance.voice = hiVoice;

        utterance.onend = () => {
          notifySpeakingChange(false);
          if (voiceQueue.length > 0) {
            speak(voiceQueue.shift()!);
          }
        };
        utterance.onerror = () => {
          notifySpeakingChange(false);
          if (voiceQueue.length > 0) {
            speak(voiceQueue.shift()!);
          }
        };

        window.speechSynthesis.speak(utterance);
        return;
      }

      notifySpeakingChange(false);
      if (voiceQueue.length > 0) {
        speak(voiceQueue.shift()!);
      }
      return;
    }

    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    currentAudio = audio;

    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      currentAudio = null;
      notifySpeakingChange(false);
      if (voiceQueue.length > 0) {
        speak(voiceQueue.shift()!);
      }
    };

    audio.onerror = () => {
      URL.revokeObjectURL(audioUrl);
      currentAudio = null;
      notifySpeakingChange(false);
      if (voiceQueue.length > 0) {
        speak(voiceQueue.shift()!);
      }
    };

    await audio.play();
  } catch (err) {
    console.warn('Speak playback error:', err);
    notifySpeakingChange(false);
    if (voiceQueue.length > 0) {
      speak(voiceQueue.shift()!);
    }
  }
}
