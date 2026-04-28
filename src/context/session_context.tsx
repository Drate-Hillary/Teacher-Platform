'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

export interface SessionAttachment {
  id: string;
  name: string;
  type: 'pdf' | 'ppt' | 'doc' | 'video' | 'link';
  url: string;
  size?: string;
}

export interface Session {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  platform: 'zoom' | 'google-meet' | 'microsoft-teams';
  meetingLink: string;
  course: string;
  class: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  attachments: SessionAttachment[];
  recordingUrl?: string;
  attendees: number;
  notifyStudents: boolean;
  createdAt: string;
}

interface SessionContextType {
  sessions: Session[];
  createSession: (session: Omit<Session, 'id' | 'createdAt'>) => void;
  updateSession: (id: string, updates: Partial<Session>) => void;
  deleteSession: (id: string) => void;
  getSession: (id: string) => Session | undefined;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: '1',
      title: 'Data Structures & Algorithms Review',
      description: 'Comprehensive review of binary trees, hash tables, and sorting algorithms',
      date: '2026-04-27',
      startTime: '10:00',
      endTime: '11:30',
      duration: 90,
      platform: 'zoom',
      meetingLink: 'https://zoom.us/j/123456789',
      course: 'Computer Science',
      class: 'Grade 12-A',
      status: 'scheduled',
      attachments: [
        { id: 'a1', name: 'Binary Trees Slides', type: 'ppt', url: '#', size: '2.4 MB' },
        { id: 'a2', name: 'Practice Problems PDF', type: 'pdf', url: '#', size: '1.1 MB' },
      ],
      attendees: 28,
      notifyStudents: true,
      createdAt: '2026-04-25T08:00:00Z',
    },
    {
      id: '2',
      title: 'Physics Lab Discussion',
      description: 'Discussing lab results and upcoming practical examination preparation',
      date: '2026-04-27',
      startTime: '14:00',
      endTime: '15:00',
      duration: 60,
      platform: 'google-meet',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      course: 'Physics Lab',
      class: 'Grade 11-B',
      status: 'live',
      attachments: [],
      attendees: 25,
      notifyStudents: true,
      createdAt: '2026-04-26T12:00:00Z',
    },
    {
      id: '3',
      title: 'Statistics Office Hours',
      description: 'Extra help session for students struggling with probability distributions',
      date: '2026-04-28',
      startTime: '15:00',
      endTime: '16:00',
      duration: 60,
      platform: 'microsoft-teams',
      meetingLink: 'https://teams.microsoft.com/l/meetup-join/123',
      course: 'Statistics',
      class: 'Grade 12-B',
      status: 'scheduled',
      attachments: [
        { id: 'a3', name: 'Probability Cheat Sheet', type: 'pdf', url: '#', size: '856 KB' },
      ],
      attendees: 15,
      notifyStudents: false,
      createdAt: '2026-04-26T15:00:00Z',
    },
  ]);

  const createSession = (sessionData: Omit<Session, 'id' | 'createdAt'>) => {
    const newSession: Session = {
      ...sessionData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setSessions(prev => [...prev, newSession]);
    toast.success('Session created successfully!');
    
    if (sessionData.notifyStudents) {
      toast.success('Students have been notified via email and dashboard');
    }
  };

  const updateSession = (id: string, updates: Partial<Session>) => {
    setSessions(prev =>
      prev.map(session =>
        session.id === id ? { ...session, ...updates } : session
      )
    );
    toast.success('Session updated successfully!');
  };

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(session => session.id !== id));
    toast.success('Session deleted successfully!');
  };

  const getSession = (id: string) => {
    return sessions.find(session => session.id === id);
  };

  return (
    <SessionContext.Provider value={{ sessions, createSession, updateSession, deleteSession, getSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}