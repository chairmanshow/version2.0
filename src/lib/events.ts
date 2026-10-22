// Global Event Helpers for Chotelal Ji Health

export function openChatModal(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('chotelal:open-chat-modal'));
  }
}

export function openVoiceGreetingModal(): void {
  openChatModal();
}

export function openExpertPlusModal(): void {
  openChatModal();
}
