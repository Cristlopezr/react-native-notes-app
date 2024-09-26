import {createContext} from 'react';
import {useNotes} from '../hooks';

export type NotesToDelelete = {
  [noteId: string]: Note;
};

export interface Note {
  body: Record<string, any>;
  title: string;
  createdDate: string;
  modifiedDate: string;
  id: string;
  selected?: boolean;
}

type NotesContext = {
  notes: Note[];
  onSaveNote: (note: Note) => void;
  getNote: (id: string) => Note;
  onSetNotesToDelete: (note: Note | null) => void;
  notesToDelete: NotesToDelelete;
  onSendNotesToRecycleBin: () => void;
  notesInRecycleBin: Note[];
  onDeleteNoteFromRecybleBin: (noteId: string) => void;
  onRestoreNoteFromRecycleBin: (note: Note) => void;
};

type notesContextProviderProps = {
  children: React.ReactNode;
};

export const NotesContext = createContext<null | NotesContext>(null);

export const NoteContextProvider = ({children}: notesContextProviderProps) => {
  const {
    notes,
    onSaveNote,
    getNote,
    onSetNotesToDelete,
    notesToDelete,
    onSendNotesToRecycleBin,
    notesInRecycleBin,
    onDeleteNoteFromRecybleBin,
    onRestoreNoteFromRecycleBin,
  } = useNotes();

  return (
    <NotesContext.Provider
      value={{
        notes,
        onSaveNote,
        getNote,
        onSetNotesToDelete,
        notesToDelete,
        onSendNotesToRecycleBin,
        notesInRecycleBin,
        onDeleteNoteFromRecybleBin,
        onRestoreNoteFromRecycleBin,
      }}>
      {children}
    </NotesContext.Provider>
  );
};
