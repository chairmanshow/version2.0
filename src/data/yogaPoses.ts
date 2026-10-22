export interface YogaItem {
  id: string;
  name: string;
  hindiName: string;
  category: 'asanas' | 'pranayama' | 'mudras';
  targetConditions: string[];
  youtubeId: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  instructions: string[];
  benefits: string[];
  precautions: string;
}

export const YOGA_PRACTICES: YogaItem[] = [
  { id: 'bhujangasana', name: 'Bhujangasana (Cobra Pose)', hindiName: 'भुजंगासन', category: 'asanas', targetConditions: ['Piles', 'Back pain'], youtubeId: '2-o72t-v070', duration: '5 min', difficulty: 'Beginner', instructions: ['Pet ke bal leto', 'Haath kandhe ke paas', 'Saans lete hue sir uthao'], benefits: ['Piles me fayda', 'Back pain kam'], precautions: 'Avoid if pregnant' },
  { id: 'vajrasana', name: 'Vajrasana (Thunderbolt)', hindiName: 'वज्रासन', category: 'asanas', targetConditions: ['Digestion'], youtubeId: 'Y9jQ6xL_sA8', duration: '10 min', difficulty: 'Beginner', instructions: ['Sit on knees', 'Keep spine straight'], benefits: ['Digestion'], precautions: 'Knee pain' },
  { id: 'pranayama', name: 'Pranayama (Deep Breathing)', hindiName: 'प्राणायाम', category: 'pranayama', targetConditions: ['Mental health', 'Stress'], youtubeId: '6T3a8t8mP1A', duration: '10 min', difficulty: 'Beginner', instructions: ['Deep inhalation', 'Deep exhalation'], benefits: ['Mental health', 'Stress'], precautions: 'None' },
  { id: 'sarvangasana', name: 'Sarvangasana (Shoulder Stand)', hindiName: 'सर्वांगासन', category: 'asanas', targetConditions: ['Hair growth', 'Thyroid'], youtubeId: 'f0XzWb44d3U', duration: '5 min', difficulty: 'Intermediate', instructions: ['Lift legs up', 'Support back'], benefits: ['Hair growth', 'Thyroid'], precautions: 'High BP' },
  { id: 'balasana', name: 'Balasana (Child Pose)', hindiName: 'बालासन', category: 'asanas', targetConditions: ['Stress relief'], youtubeId: 'v8J6141u8wE', duration: '3 min', difficulty: 'Beginner', instructions: ['Kneel down', 'Bow forward'], benefits: ['Stress relief'], precautions: 'Knee injury' },
  { id: 'trikonasana', name: 'Trikonasana (Triangle Pose)', hindiName: 'त्रिकोणासन', category: 'asanas', targetConditions: ['General fitness'], youtubeId: 'V9U5c59gJ3A', duration: '5 min', difficulty: 'Beginner', instructions: ['Stand wide', 'Bend to side'], benefits: ['General fitness'], precautions: 'Back pain' },
  { id: 'kapalbhati', name: 'Kapalbhati', hindiName: 'कपालभाति', category: 'pranayama', targetConditions: ['Respiratory health'], youtubeId: '4B8-Y97P0h4', duration: '15 min', difficulty: 'Intermediate', instructions: ['Forceful exhalation'], benefits: ['Respiratory health'], precautions: 'Heart issues' },
  { id: 'shavasana', name: 'Shavasana (Corpse Pose)', hindiName: 'शवासन', category: 'asanas', targetConditions: ['Relaxation'], youtubeId: 'k4ZqgM48QoM', duration: '10 min', difficulty: 'Beginner', instructions: ['Lie flat', 'Relax all muscles'], benefits: ['Relaxation'], precautions: 'None' },
  { id: 'surya-namaskar', name: 'Surya Namaskar (Sun Salutation)', hindiName: 'सूर्य नमस्कार', category: 'asanas', targetConditions: ['Full body workout'], youtubeId: '3Hk605lC3zI', duration: '15 min', difficulty: 'Intermediate', instructions: ['12 steps sequence'], benefits: ['Full body workout'], precautions: 'Back pain' },
  { id: 'paschimottanasana', name: 'Paschimottanasana', hindiName: 'पश्चिमोत्तानासन', category: 'asanas', targetConditions: ['Digestion'], youtubeId: 'gR9R5iJ2d9g', duration: '5 min', difficulty: 'Intermediate', instructions: ['Sit and bend forward'], benefits: ['Digestion'], precautions: 'Back pain' },
  { id: 'bhramari-pranayama', name: 'Bhramari Pranayama', hindiName: 'भ्रामरी प्राणायाम', category: 'pranayama', targetConditions: ['Mental peace'], youtubeId: '0-Hk88VjZ3M', duration: '5 min', difficulty: 'Beginner', instructions: ['Cover ears', 'Hum'], benefits: ['Mental peace'], precautions: 'Ear infection' },
  { id: 'halasana', name: 'Halasana (Plow Pose)', hindiName: 'हलासन', category: 'asanas', targetConditions: ['Thyroid', 'Digestion'], youtubeId: 'Jk9e4U9m1Zc', duration: '5 min', difficulty: 'Intermediate', instructions: ['Lift legs over head'], benefits: ['Thyroid', 'Digestion'], precautions: 'Back/neck pain' },
  { id: 'matsyasana', name: 'Matsyasana (Fish Pose)', hindiName: 'मत्स्यासन', category: 'asanas', targetConditions: ['Respiratory'], youtubeId: 'W4U7n-K3T8o', duration: '5 min', difficulty: 'Intermediate', instructions: ['Arch back'], benefits: ['Respiratory'], precautions: 'Neck pain' },
  { id: 'dhanurasana', name: 'Dhanurasana (Bow Pose)', hindiName: 'धनुरासन', category: 'asanas', targetConditions: ['Back', 'Digestion'], youtubeId: 'u4i9a8L-5I0', duration: '5 min', difficulty: 'Intermediate', instructions: ['Hold ankles', 'Lift'], benefits: ['Back', 'Digestion'], precautions: 'Back pain' },
  { id: 'setu-bandhasana', name: 'Setu Bandhasana (Bridge Pose)', hindiName: 'सेतुबंधासन', category: 'asanas', targetConditions: ['Back pain'], youtubeId: '1U8n-5o9i1U', duration: '5 min', difficulty: 'Beginner', instructions: ['Lift hips'], benefits: ['Back pain'], precautions: 'Neck injury' },
  { id: 'anulom-vilom', name: 'Anulom Vilom', hindiName: 'अनुलोम विलोम', category: 'pranayama', targetConditions: ['Breathing balance'], youtubeId: 'Mv9I8k3-5A4', duration: '15 min', difficulty: 'Beginner', instructions: ['Alternate nostril breathing'], benefits: ['Breathing balance'], precautions: 'None' },
  { id: 'gomukhasana', name: 'Gomukhasana (Cow Face)', hindiName: 'गोमुखासन', category: 'asanas', targetConditions: ['Back pain'], youtubeId: 'Y9I8k-2o9aA', duration: '5 min', difficulty: 'Beginner', instructions: ['Stack knees', 'Lock hands'], benefits: ['Back pain'], precautions: 'Shoulder injury' },
  { id: 'ustrasana', name: 'Ustrasana (Camel Pose)', hindiName: 'उष्ट्रासन', category: 'asanas', targetConditions: ['Back flexibility'], youtubeId: 'w-4U8k-5O1Q', duration: '5 min', difficulty: 'Intermediate', instructions: ['Kneel', 'Hold heels'], benefits: ['Back flexibility'], precautions: 'Back/neck pain' },
  { id: 'ardha-matsyendrasana', name: 'Ardha Matsyendrasana', hindiName: 'अर्ध मत्स्येन्द्रासन', category: 'asanas', targetConditions: ['Digestion'], youtubeId: 'v8-4U8k-5O1', duration: '5 min', difficulty: 'Intermediate', instructions: ['Twist'], benefits: ['Digestion'], precautions: 'Back pain' },
  { id: 'shashankasana', name: 'Shashankasana (Hare Pose)', hindiName: 'शशांकासन', category: 'asanas', targetConditions: ['Stress', 'Back'], youtubeId: 'q8-4U8k-5O1', duration: '5 min', difficulty: 'Beginner', instructions: ['Sit', 'Bend forward'], benefits: ['Stress', 'Back'], precautions: 'Knee pain' },
];
