import {useEffect} from 'react';
import {View} from 'react-native';
import {CustomHeader, CustomIcon, IconButton, NoteInputView, Styles, TextEditAction} from '../components';
import texts from '../../locales/es';
import {useEditText, useNotesContext, useThemeContext} from '../hooks';
import {icons} from '../icons';
import {NativeStackNavigationProp, NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../routes';
import {ParamListBase} from '@react-navigation/native';
import {textEditActions} from '../../lib/textEditActions';

type Props = NativeStackScreenProps<RootStackParamList, 'NewNoteScreen'>;

const initialNote = {
  body: [{id: '', text: '', style: {}, stylesId: []}],
  title: '',
  modifiedDate: '',
  createdDate: '',
  id: '',
  selected: false,
};

export const NewNoteScreen = ({navigation}: Props) => {
  const {colors} = useThemeContext();
  const {onSaveNote} = useNotesContext();
  const {note, onChangeInput, actionsStylesInUse, onClickEditTextAction, onSelectText, stylesIdInUse} =
    useEditText(initialNote);

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

  return (
    <>
      <NoteInputView note={note} onChangeInput={onChangeInput} onSelectText={onSelectText} />
      <View style={{padding: 20, marginBottom: 20, flexDirection: 'row', gap: 10}}>
        {textEditActions.map(action => (
          <TextEditAction
            key={action.actionName}
            text={action.text}
            style={action.style}
            isActive={actionsStylesInUse.includes(action) || stylesIdInUse.includes(action.id)}
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
