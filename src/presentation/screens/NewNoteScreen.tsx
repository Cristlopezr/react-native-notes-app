import {useEffect, useState} from 'react';
import {TextInput, View} from 'react-native';
import {CustomHeader, CustomIcon, IconButton} from '../components';
import texts from '../../locales/es';
import {useNotesContext, useThemeContext} from '../hooks';
import {icons} from '../icons';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {RootStackParamList} from '../routes';
import {ParamListBase} from '@react-navigation/native';
import {Note} from '../contexts';

type Props = NativeStackScreenProps<RootStackParamList, 'NewNoteScreen'>;

export const NewNoteScreen = ({navigation}: Props) => {
  const {onSaveNote} = useNotesContext();
  const [note, setNote] = useState<Note>({
    body: '',
    title: '',
    modifiedDate: '',
    createdDate: '',
    id: '',
  });

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
      [field]: value,
    }));
  };

  const onClickSaveNote = () => {
    if (note.title === '' || note.body === '') return;
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
    <View style={{flex: 1, paddingHorizontal: 25}}>
      <TextInput
        onChangeText={(value: string) => onChangeInput(value, 'body')}
        multiline
        autoFocus
        style={{flex: 1, textAlignVertical: 'top'}}
      />
    </View>
  );
};

type HeaderProps = {
  navigation: NativeStackNavigationProp<ParamListBase, string, undefined>;
  noteTitle: string;
  onChangeInput?: (value: string) => void;
  onClickSaveNote: () => void;
};

const Header = ({
  navigation,
  noteTitle,
  onChangeInput,
  onClickSaveNote,
}: HeaderProps) => {
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
            <CustomIcon
              name={icons.back.name}
              size={icons.back.size}
              color={colors.text}
              style={{marginLeft: -8}}
            />
          }
        />
      }
      leftIcon={
        <IconButton
          onPress={onClickSaveNote}
          icon={
            <CustomIcon
              name={icons.save.name}
              size={icons.save.size}
              color={colors.text}
            />
          }
        />
      }
    />
  );
};
