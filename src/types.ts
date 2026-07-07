export interface Service {
  id: string;
  name: string;
  nameRegional?: string;
  category: 'Identity' | 'Welfare' | 'Finance' | 'Health' | 'Agriculture' | 'Education';
  description: string;
  eligibility: string[];
  documentsRequired: string[];
  processingTime: string;
  benefits: string;
  officialPortal: string;
}

export interface Complaint {
  id: string;
  category: string;
  title: string;
  description: string;
  location: string;
  state: string;
  pincode: string;
  status: 'submitted' | 'assigned' | 'investigating' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  citizenName: string;
  citizenPhone: string;
  citizenEmail: string;
  department: string;
  trackingTimeline: {
    status: string;
    label: string;
    date: string;
    description: string;
    active: boolean;
  }[];
  updates: {
    date: string;
    text: string;
    author: string;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  language: string;
  translatedText?: string;
}

export interface SchemeSearchQuery {
  age?: number;
  income?: string;
  category?: string;
  state?: string;
  occupation?: string;
}
