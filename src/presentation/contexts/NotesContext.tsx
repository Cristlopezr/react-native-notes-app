import {createContext} from 'react';
import {useNotes} from '../hooks';
import { StyleProp, TextStyle } from 'react-native';

export type NotesToDelelete = {
  [noteId: string]: Note;
};

export interface NoteBody {
  id: string;
  text: string;
  styles?: StyleProp<TextStyle>;
}

export interface Note {
  body: NoteBody[];
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
