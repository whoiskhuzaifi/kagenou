export type Role = 'mahasiswa' | 'admin';

export type TabId =
  | 'dashboard'
  | 'schedule'
  | 'announcements'
  | 'tasks'
  | 'finance'
  | 'academic'
  | 'forum';

export type AcademicSubTab =
  | 'journals'
  | 'books'
  | 'grades'
  | 'citations'
  | 'planner'
  | 'media';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  category: string;
}

export interface Schedule {
  id: string;
  day: string;
  time: string;
  subject: string;
  room: string;
  lecturer: string;
}

export interface Task {
  id: string;
  title: string;
  subject: string;
  deadline: string;
  status: 'Pending' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  description: string;
}

export interface Transaction {
  id: string;
  type: 'in' | 'out';
  amount: number;
  description: string;
  date: string;
  recordedBy: string;
}

export interface KasSummary {
  totalIn: number;
  totalOut: number;
  balance: number;
}

export interface Reply {
  author: string;
  role: Role;
  time: string;
  message: string;
}

export interface ForumPost {
  id: string;
  author: string;
  role: Role;
  time: string;
  message: string;
  replies: Reply[];
}

export interface StudyPlan {
  id: string;
  title: string;
  date: string;
  duration: string;
  isDone: boolean;
}

// OpenAlex API Types
export interface Work {
  id: string;
  title: string;
  publication_year: number;
  doi?: string;
  cited_by_count: number;
  primary_location?: {
    landing_page_url?: string;
    pdf_url?: string;
  };
  authorships?: Array<{
    author: {
      display_name: string;
    };
  }>;
}

// OpenLibrary API Types
export interface BookItem {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
}
