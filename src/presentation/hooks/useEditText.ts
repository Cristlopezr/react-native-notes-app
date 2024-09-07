import {useState} from 'react';
import {Note, NoteBody} from '../contexts';
import {textEditActions, TextEditActions} from '../../lib/textEditActions';
import {NativeSyntheticEvent, TextInputSelectionChangeEventData} from 'react-native';

export const useEditText = (initialNote: Note) => {
  const [note, setNote] = useState<Note>(initialNote);
  const [actionsStylesInUse, setActionsStylesInUse] = useState<TextEditActions[]>([]);
  const [selection, setSelection] = useState<{start: number; end: number}>({start: 0, end: 0});
  const [stylesIdInUse, setStylesIdInUse] = useState<number[]>([]);

  const onChangeInput = (value: string, field: string) => {
    //Mejorar esta funcion para no revisar todos los caracteres cada vez que se tipea algo
    if (field === 'body') {
      const styles = Object.assign({}, ...actionsStylesInUse.map(action => action.style));
      const inputValue = [...value].map((item, i) => {
        if (i === selection?.start && selection?.start === selection?.end && actionsStylesInUse.length > 0) {
          return {id: i.toString(), text: item, style: styles, stylesId: actionsStylesInUse.map(({id}) => id)};
        }

        return note.body[i]?.id
          ? {id: note.body[i].id, text: note.body[i].text, style: note.body[i].style, stylesId: note.body[i].stylesId}
          : {id: i.toString(), text: item, style: {}, stylesId: []};
      });

      setNote(prevNote => ({
        ...prevNote,
        body: inputValue,
      }));
      return;
    }

    setNote(prevNote => ({
      ...prevNote,
      [field]: value,
    }));
  };

  const onSelectText = ({nativeEvent: {selection}}: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
    setSelection(selection);
    if (selection.start !== selection.end) {
      const actionsIds = textEditActions.map(({id}) => id);
      const stylesAlreadyInUse = note.body
        .filter(item => Number(item.id) >= selection.start && Number(item.id) <= selection.end)
        .flatMap(item => item?.stylesId)
        .filter(id => actionsIds.includes(id));

      setStylesIdInUse(stylesAlreadyInUse);
    }
  };

  const onClickEditTextAction = (action: TextEditActions) => {
    setStylesIdInUse([]);
    if (selection.start === selection.end) {
      //Verificar si los estilos y sus ids estan en uso y los borramos
      if (actionsStylesInUse.includes(action)) {
        const newActionsStylesInUse = actionsStylesInUse.filter(actionStyleInUse => actionStyleInUse.id !== action.id);
        setActionsStylesInUse(newActionsStylesInUse);
        return;
      }

      //Si no esta siendo usado seteamos el valor, seteamos la action con su style y id
      setActionsStylesInUse([...new Set([...actionsStylesInUse, action])]);
      return;
    }

    //Revisar si en todos los elementos del body esta el estilo en uso con every
    const isStyleAlreadyInUse = note.body
      .filter(item => Number(item.id) >= selection.start && Number(item.id) <= selection.end)
      .every(item => item?.stylesId?.includes(action.id));

    const body = note.body.map<NoteBody>(item => {
      if (Number(item.id) >= selection.start && Number(item.id) <= selection.end) {
        const currentStyles = item.style;
        const additionalStyle = action.style;

        //Si el estilo esta en uso en todos los elementos, borramos el estilo y borramos el id del estilo
        if (isStyleAlreadyInUse) {
          const {[Object.keys(additionalStyle!)[0]]: _, ...updatedStyles} = currentStyles!;
          return {
            ...item,
            style: updatedStyles,
            stylesId: item.stylesId.filter(styleId => styleId !== action.id),
          };
        }

        //Si no esta utilizado agregamos el estilo y su id
        return {
          ...item,
          style: {...currentStyles, ...additionalStyle},
          stylesId: [...item.stylesId, action.id],
        };
      }

      return item;
    });

    setNote(prevNote => ({
      ...prevNote,
      body,
    }));
  };

  const onSetNote = (note: Note) => {
    setNote(note);
  };

  return {
    note,
    onSetNote,
    actionsStylesInUse,
    stylesIdInUse,
    onChangeInput,
    onSelectText,
    onClickEditTextAction,
  };
};
