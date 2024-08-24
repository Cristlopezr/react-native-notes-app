import {useContext} from 'react';
import {NotesContext} from '../contexts';

export const useNotesContext = () => {
  const notesContext = useContext(NotesContext);
  if (!notesContext) {
    throw new Error('NoteContext should be used within NoteContextProvider');
  }

  return notesContext;
};
