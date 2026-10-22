export interface YogaExercise {
  id: string;
  name: string;
  englishName: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnailUrl: string;
  imageUrl?: string;
  threeDModelUrl?: string | null;
  instructions: string[];
  breathing: string;
  benefits: string[];
  modifications: string;
  precautions: string;
  duration: string;
}
