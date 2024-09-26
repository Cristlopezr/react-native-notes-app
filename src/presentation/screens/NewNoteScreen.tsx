import {useEffect, useState} from 'react';
import {CustomHeader, CustomIcon, Editor, IconButton} from '../components';
import texts from '../../locales/es';
import {useEditor, useNotesContext, useThemeContext} from '../hooks';
import {icons} from '../icons';
import {NativeStackNavigationProp, NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../routes';
import {ParamListBase} from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'NewNoteScreen'>;

const initialNote = {
  body: {},
  title: '',
  modifiedDate: '',
  createdDate: '',
  id: '',
  selected: false,
};

export const NewNoteScreen = ({navigation}: Props) => {
  const {onSaveNote} = useNotesContext();
  const [note, setNote] = useState(initialNote);
  const {editor} = useEditor({initialContent: initialNote.body});

  useEffect(() => {
    navigation.setOptions({
      header: ({navigation}) => (
        <Header
          navigation={navigation}
          noteTitle={note.title}
          onChangeInput={(value: string) => onChangeInput(value)}
          onClickSaveNote={onClickSaveNote}
        />
      ),
    });
    return () => {};
  }, [note]);

  const onChangeInput = (value: string) => {
    setNote(prevNote => ({
      ...prevNote,
      title: value,
    }));
  };

  const onClickSaveNote = async () => {
    //Mostrar alerta si no hay contenido

    const body = await editor.getJSON();

    if (note.title === '' || Object.keys(body).length === 0) return;
    const noteToSave = {
      ...note,
      body,
      createdDate: new Date().getTime().toString(),
      modifiedDate: new Date().getTime().toString(),
      id: new Date().getTime().toString(),
    };
    onSaveNote(noteToSave);
    navigation.navigate('NotesScreen');
  };

  return <Editor editor={editor} editorStyle={{paddingHorizontal: 20}} />;
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
