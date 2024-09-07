import {useEffect, useState} from 'react';
import {NativeSyntheticEvent, StyleProp, TextInputSelectionChangeEventData, TextStyle, View} from 'react-native';
import {CustomHeader, CustomIcon, IconButton, NoteInputView, Styles, TextEditAction} from '../components';
import texts from '../../locales/es';
import {useNotesContext, useThemeContext} from '../hooks';
import {icons} from '../icons';
import {NativeStackNavigationProp, NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../routes';
import {ParamListBase} from '@react-navigation/native';
import {Note, NoteBody} from '../contexts';
import {convertStyleToObject} from '../helpers';
import {TextEditActions, textEditActions} from '../../lib/textEditActions';

type Props = NativeStackScreenProps<RootStackParamList, 'NewNoteScreen'>;

export const NewNoteScreen = ({navigation}: Props) => {
  const {colors} = useThemeContext();
  const {onSaveNote} = useNotesContext();
  const [actionsStylesInUse, setActionsStylesInUse] = useState<TextEditActions[]>([]);
  const [usedStylesIds, setUsedStylesIds] = useState<number[]>([]);
  const [note, setNote] = useState<Note>({
    body: [{id: '', text: '', style: {}}],
    title: '',
    modifiedDate: '',
    createdDate: '',
    id: '',
    selected: false,
  });

  const [selection, setSelection] = useState<{start: number; end: number}>();

  useEffect(() => {
    navigation.setOptions({
      header: ({navigation}) => (
        <Header
          navigation={navigation}
          noteTitle={note.title}
          onChangeInput={(value: string) => onChangeInput(value, 'title')}
          onClickSaveNote={onClickSaveNote}
        />
      ),
    });
    return () => {};
  }, [note]);

  const onChangeInput = (value: string, field: string) => {
    if (field === 'body') {
      const styles = Object.assign({}, ...actionsStylesInUse.map(action => action.style));

      const inputValue = [...value].map((item, i) => {
        if (i === selection?.start && selection?.start === selection?.end && actionsStylesInUse.length > 0) {
          return {id: i.toString(), text: item, style: styles};
        }

        return note.body[i]?.id
          ? {id: note.body[i].id, text: note.body[i].text, style: note.body[i].style}
          : {id: i.toString(), text: item};
      });

      console.log(inputValue)
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

  const onClickSaveNote = () => {
    if (note.title === '' || note.body.length === 0) return;
    const noteToSave = {
      ...note,
      createdDate: new Date().getTime().toString(),
      modifiedDate: new Date().getTime().toString(),
      id: new Date().getTime().toString(),
    };
    onSaveNote(noteToSave);
    navigation.navigate('NotesScreen');
  };

  const onSelectText = ({nativeEvent: {selection}}: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
    setSelection(selection);

    const selectedBody = note.body.filter(
      item => Number(item.id) >= selection.start && Number(item.id) <= selection.end,
    );

    const usedStylesIds = [...new Set(selectedBody.flatMap(item => item.stylesId || []))];
    setUsedStylesIds(usedStylesIds);
  };

  const onClickEditTextAction = (action: TextEditActions) => {
    //Verificar si los estilos y sus ids estan en uso y los borramos
    if (actionsStylesInUse.includes(action)) {
      const newActionsStylesInUse = actionsStylesInUse.filter(actionStyleInUse => actionStyleInUse.id !== action.id);
      setActionsStylesInUse(newActionsStylesInUse);
    }

    //Si no esta siendo usado seteamos el valor
    if (!actionsStylesInUse.includes(action)) {
      //Seteamos los estilos en uso y sus Ids
      setActionsStylesInUse([...new Set([...actionsStylesInUse, action])]);
    }

    if (!selection) {
      return;
    }

    //Estilos fijos
    if (selection.start === selection.end) {
      //Seteamos la seleccion en la que iniciar a poner los estilos
    }

    //Revisar si en todos esta el estilo en uso con every
    const isStyleAlreadyInUse = note.body
      .filter(item => Number(item.id) >= selection.start && Number(item.id) <= selection.end)
      .every(item => item.stylesId?.includes(action.id));

    /* const body = note.body.map<NoteBody>(item => {
      if (Number(item.id) >= selection.start && Number(item.id) <= selection.end) {
        let currentStyles = convertStyleToObject(item.styles);
        const additionalStyle = convertStyleToObject(action);

        if (isStyleAlreadyInUse) {
          const {[Object.keys(additionalStyle)[0]]: _, ...newStyles} = currentStyles;
          currentStyles = newStyles;
        }

        let stylesId: number[] = [];
        if (item.stylesId) {
          stylesId = isStyleAlreadyInUse ? item.stylesId.filter(styleId => styleId !== action.id) : [...item.stylesId, action.id];
        } else {
          stylesId = [action.id];
        }

        return {
          ...item,
          styles: isStyleAlreadyInUse ? {...currentStyles} : {...currentStyles, ...additionalStyle},
          stylesId: stylesId,
        };
      }
      return item;
    }); */

    setNote(prevNote => ({
      ...prevNote,
    }));
  };
  return (
    <>
      <NoteInputView note={note} onChangeInput={onChangeInput} onSelectText={onSelectText} />
      <View style={{padding: 20, marginBottom: 20, flexDirection: 'row', gap: 10}}>
        {textEditActions.map(action => (
          <TextEditAction
            key={action.actionName}
            text={action.text}
            style={action.style}
            isActive={actionsStylesInUse.includes(action)}
            activeColorBg={colors.border}
            color={colors.text}
            onPress={() => onClickEditTextAction(action)}
          />
        ))}
      </View>
    </>
  );
};

type HeaderProps = {
  navigation: NativeStackNavigationProp<ParamListBase, string, undefined>;
  noteTitle: string;
  onChangeInput?: (value: string) => void;
  onClickSaveNote: () => void;
};

const Header = ({navigation, noteTitle, onChangeInput, onClickSaveNote}: HeaderProps) => {
  const {colors} = useThemeContext();
  return (
    <CustomHeader
      inputPlaceHolder={texts.createHeaderPlaceholder}
      placeHolderTextColor={colors.lightText}
      inputStyle={{fontSize: 30, fontWeight: '500'}}
      backgroundColor={colors.background}
      isInput
      inputValue={noteTitle}
      onChangeInput={onChangeInput}
      backButton={
        <IconButton
          onPress={navigation.goBack}
          icon={
            <CustomIcon name={icons.back.name} size={icons.back.size} color={colors.text} style={{marginLeft: -8}} />
          }
        />
      }
      leftIcon={
        <IconButton
          onPress={onClickSaveNote}
          icon={<CustomIcon name={icons.save.name} size={icons.save.size} color={colors.text} />}
        />
      }
    />
  );
};
