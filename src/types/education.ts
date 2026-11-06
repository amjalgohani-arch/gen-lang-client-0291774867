export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  type: 'video' | 'simulation' | 'reading' | 'code';
  summary: string;
  content: string;
  formula?: string;
  keyPoints: string[];
}

export interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  titleEn: string;
  category: 'ai' | 'physics' | 'math' | 'business';
  categoryLabel: string;
  level: 'مبتدئ' | 'متوسط' | 'متقدم';
  durationHours: number;
  lessonsCount: number;
  rating: number;
  reviewsCount: number;
  instructor: {
    name: string;
    title: string;
    avatar: string;
  };
  image: string;
  description: string;
  outcomes: string[];
  chapters: Chapter[];
}

export interface Flashcard {
  id: string;
  category: string;
  question: string;
  answer: string;
  detail: string;
  known?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface StudentProgress {
  totalStudyMinutes: number;
  completedLessons: string[]; // lesson ids
  completedCourses: string[]; // course ids
  streakDays: number;
  quizScoreAverage: number;
  flashcardsMastered: number;
}
