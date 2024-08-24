import {useEffect, useState} from 'react';
import {Note, NotesToDelelete} from '../contexts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getDaysLeftToDelete} from '../helpers';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [notesToDelete, setNotesToDelete] = useState<NotesToDelelete>({});
  const [notesInRecycleBin, setNotesInRecycleBin] = useState<Note[]>([]);

  useEffect(() => {
    getAllNotes();
  }, []);

  useEffect(() => {
    getNotesInRecycleBin();
  }, []);

  const onUpdateNotes = async (notes: Note[], type: 'notes' | 'recyle') => {
    try {
      if (type === 'notes') {
        setNotes(notes);
        await AsyncStorage.setItem('notes', JSON.stringify(notes));
        return;
      }
      await AsyncStorage.setItem('notesInRecycleBin', JSON.stringify(notes));
      setNotesInRecycleBin(notes);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllNotes = async () => {
    try {
      const notes = await AsyncStorage.getItem('notes');

      if (notes) {
        setNotes(JSON.parse(notes));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getNote = (id: string): Note => {
    const note = notes.find(note => note.id === id);
    if (!note) {
      return {
        id: '',
        body: '',
        title: '',
        createdDate: '',
        modifiedDate: '',
        selected: false,
      };
    }
    return note;
  };

  //Edit and save new note
  const onSaveNote = async (newNote: Note) => {
    try {
      const remainingNotes = notes.filter(note => note.id !== newNote.id);
      const newNotes = [...remainingNotes, newNote];
      onUpdateNotes(newNotes, 'notes');
    } catch (error) {
      console.log(error);
    }
  };

  const onSetNotesToDelete = (note: Note | null) => {
    if (!note) {
      setNotesToDelete({});
      return;
    }
    const noteExists = notesToDelete[note.id];
    if (noteExists) {
      delete notesToDelete[note.id];
      const newNotesToDelete = {...notesToDelete};
      setNotesToDelete(newNotesToDelete);
      return;
    }
    const newNotesToDelete = {
      ...notesToDelete,
      [note.id]: note,
    };
    setNotesToDelete(newNotesToDelete);
  };

  const onSendNotesToRecycleBin = async () => {
    const notesToDeleteArray = Object.entries(notesToDelete).map(([key, value]) => {
      return value;
    });

    const remainingNotes = notes.filter(
      ({id}) => !notesToDeleteArray.some(nota => nota.id === id),
    );
    onUpdateNotes(remainingNotes, 'notes');
    onUpdateNotes([...notesInRecycleBin, ...notesToDeleteArray], 'recyle');
  };

  const getNotesInRecycleBin = async () => {
    try {
      const notesInRecycleBin = await AsyncStorage.getItem('notesInRecycleBin');
      if (notesInRecycleBin) {
        const notes: Note[] = JSON.parse(notesInRecycleBin);
        let newNotesInRecycleBin: Note[] = [];
        notes.forEach(note => {
          if (getDaysLeftToDelete(note.createdDate) > 0) {
            newNotesInRecycleBin.push(note);
          }
        });
        setNotesInRecycleBin(newNotesInRecycleBin);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onDeleteNoteFromRecybleBin = async (noteId: string) => {
    const newNotesInRecycleBin = notesInRecycleBin.filter(
      ({id}) => id !== noteId,
    );
    onUpdateNotes(newNotesInRecycleBin, 'recyle');
  };

  const onRestoreNoteFromRecycleBin = (note: Note) => {
    onDeleteNoteFromRecybleBin(note.id);
    const newNotes = [...notes, note];
    onUpdateNotes(newNotes, 'notes');
  };

  return {
    notes,
    onUpdateNotes,
    //onDeleteNote,
    onSaveNote,
    getNote,
    onSetNotesToDelete,
    notesToDelete,
    onSendNotesToRecycleBin,
    notesInRecycleBin,
    onDeleteNoteFromRecybleBin,
    onRestoreNoteFromRecycleBin,
  };
};
