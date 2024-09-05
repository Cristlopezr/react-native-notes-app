import {useEffect, useRef, useState} from 'react';
import {
  NativeSyntheticEvent,
  Pressable,
  StyleProp,
  Text,
  TextInput,
  TextInputSelectionChangeEventData,
  TextStyle,
  View,
} from 'react-native';
import {CustomHeader, CustomIcon, IconButton, TextEditAction} from '../components';
import texts from '../../locales/es';
import {useNotes, useNotesContext, useThemeContext} from '../hooks';
import {icons} from '../icons';
import {NativeStackNavigationProp, NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../routes';
import {ParamListBase} from '@react-navigation/native';
import {Note, NoteBody} from '../contexts';
import {textEditActions} from '../../lib/textEditActions';

type Props = NativeStackScreenProps<RootStackParamList, 'NewNoteScreen'>;

export const NewNoteScreen = ({navigation}: Props) => {
  const {colors} = useThemeContext();
  const {onSaveNote} = useNotesContext();
  const {getEditedNoteBody} = useNotes();
  const [note, setNote] = useState<Note>({
    body: [{id: '', text: '', styles: {}}],
    title: '',
    modifiedDate: '',
    createdDate: '',
    id: '',
    selected: false,
  });

  const [selection, setSelection] = useState<{start: number; end: number}>();

  const inputRef = useRef<TextInput>(null);

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
    setNote(prevNote => ({
      ...prevNote,
      [field]:
        field === 'body'
          ? [...value].map<NoteBody>((item, i) => ({
              id: i.toString(),
              text: item,
            }))
          : value,
    }));
  };

  const onClickSaveNote = () => {
    if (note.title === '' /*  || note.body === '' */) return;
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
  };

  /*   setNote(prevNote => ({
    ...prevNote,
    body,
  })); */

  return (
    <View style={{flex: 1, marginHorizontal: 25, position: 'relative'}}>
      <TextInput
        onSelectionChange={onSelectText}
        onChangeText={(value: string) => onChangeInput(value, 'body')}
        multiline
        autoFocus
        ref={inputRef}
        style={{
          flex: 1,
          textAlignVertical: 'top',
        }}>
        {note.body.map(item => (
          <Text key={item.id} style={[item.styles]}>
            {item.text}
          </Text>
        ))}
      </TextInput>
      <View style={{padding: 20, marginBottom: 20, flexDirection: 'row', gap: 20}}>
        {textEditActions.map(action => (
          <TextEditAction
            key={action.actionName}
            {...action}
            color={colors.text}
            onPress={() => {
              const body: NoteBody[] = getEditedNoteBody(action.actionName, action.style, selection!, note);

              setNote(prevNote => ({
                ...prevNote,
                body,
              }));
            }}
          />
        ))}
      </View>
    </View>
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
