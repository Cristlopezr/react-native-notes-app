import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {RootStackParamList} from '../routes';
import {useEffect, useState} from 'react';
import {CustomHeader, CustomIcon, IconButton} from '../components';
import {useNotesContext, useThemeContext} from '../hooks';
import {icons} from '../icons';
import {Note} from '../contexts';

type Props = NativeStackScreenProps<RootStackParamList, 'NoteScreen'>;

const initialNote: Note = {
  id: '',
  body: [],
  createdDate: '',
  modifiedDate: '',
  title: '',
};

export const NoteScreen = ({navigation: navigationStack, route}: Props) => {
  const {colors} = useThemeContext();
  const {getNote, onSaveNote} = useNotesContext();
  const [note, setNote] = useState<Note>(initialNote);
  const [isEdit, setIsEdit] = useState(false);
  const {id} = route.params;

  useEffect(() => {
    const note = getNote(id);
    setNote(note);
  }, [id]);

  useEffect(() => {
    const conditionalProps = isEdit
      ? {
          isInput: true,
          inputValue: note.title,
          autoFocus: true,
          inputStyle: {fontSize: 16},
          onChangeInput: (value: string) => {
            onChangeInput(value, 'title');
          },
          leftIcon: (
            <IconButton
              onPress={() => {
                if (note.title === '' /* || note.body === '' */) return;
                const noteToSave = {
                  ...note,
                  modifiedDate: new Date().getTime().toString(),
                };
                setIsEdit(false);
                onSaveNote(noteToSave);
              }}
              icon={
                <CustomIcon
                  name={icons.save.name}
                  size={icons.save.size}
                  color={colors.text}
                />
              }
            />
          ),
        }
      : {
          title: note.title,
          titleStyle: {flex: 1, color: colors.text, fontSize: 16},
          leftIcon: (
            <IconButton
              onPress={() => setIsEdit(true)}
              icon={
                <CustomIcon
                  name={icons.create.name}
                  size={icons.create.size}
                  color={colors.text}
                />
              }
            />
          ),
        };
    navigationStack.setOptions({
      header: () => (
        <CustomHeader
          backgroundColor={colors.background}
          {...conditionalProps}
          backButton={
            <IconButton
              onPress={() => navigationStack.navigate('NotesScreen')}
              icon={
                <CustomIcon
                  name={icons.back.name}
                  size={28}
                  color={colors.text}
                  style={{marginLeft: -8}}
                />
              }
            />
          }
        />
      ),
    });

    return () => {};
  }, [note, isEdit]);

  const onChangeInput = (value: string, field: string) => {
    setNote(prevNote => ({
      ...prevNote,
      [field]: value,
    }));
  };

  return (
    <View style={styles.container}>
      {isEdit ? (
        <TextInput
          style={{
            flex: 1,
            textAlignVertical: 'top',
          }}
          onChangeText={(value: string) => onChangeInput(value, 'body')}>
          {note.body.map(item => (
            <Text key={item.id} style={[item.styles]}>
              {item.text}
            </Text>
          ))}
        </TextInput>
      ) : (
        <View style={{flexDirection: 'row'}}>
          {note.body.map(item => (
            <Text key={item.id} style={[item.styles, {color: colors.text}]}>
              {item.text}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
});
