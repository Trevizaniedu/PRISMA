// src/types.ts

export interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  imageUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  avatarUrl?: string;
}