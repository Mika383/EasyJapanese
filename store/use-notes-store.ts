"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

interface NotesState {
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'updatedAt'>) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set) => ({
      notes: [],
      addNote: (note) => set((state) => ({
        notes: [
          ...state.notes,
          {
            ...note,
            id: Math.random().toString(36).substring(2, 9),
            updatedAt: Date.now(),
          },
        ],
      })),
      updateNote: (id, updatedNote) => set((state) => ({
        notes: state.notes.map((n) => 
          n.id === id ? { ...n, ...updatedNote, updatedAt: Date.now() } : n
        ),
      })),
      deleteNote: (id) => set((state) => ({
        notes: state.notes.filter((n) => n.id !== id),
      })),
    }),
    {
      name: 'easy-japanese-notes',
    }
  )
)
