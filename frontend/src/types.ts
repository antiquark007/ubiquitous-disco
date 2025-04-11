export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  phone: string;
  dob: string;
  profile_photo: string;
  language: string;
  about: string;
} 
export interface GameScore {
  correct: number;
  total: number;
  timeSpent: number;
}

export interface Word {
  word: string;
  pronunciation: string;
  imageUrl: string;
}

export interface MathProblem {
  question: string;
  answer: number;
  options: number[];
}

export interface MemoryCard {
  id: number;
  word: string;
  imageUrl: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface CreativePrompt {
  id: number;
  imageUrl: string;
  question: string;
  hints: string[];
}
 export interface GameCardProps {
  title: string;
  description: string;
  path: string;
  icon: React.ReactNode;
}