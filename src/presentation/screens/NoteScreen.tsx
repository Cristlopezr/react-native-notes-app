import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {RootStackParamList} from '../routes';
import {useEffect, useState} from 'react';
import {CustomHeader, CustomIcon, Editor, IconButton} from '../components';
import {useEditor, useNotesContext, useThemeContext} from '../hooks';
import {icons} from '../icons';

type Props = NativeStackScreenProps<RootStackParamList, 'NoteScreen'>;
export const NoteScreen = ({navigation: navigationStack, route}: Props) => {
  const {colors} = useThemeContext();
  const {getNote, onSaveNote} = useNotesContext();

  const [isEdit, setIsEdit] = useState(false);
  const {id} = route.params;
  const [note, setNote] = useState(getNote(id));

  const {editor} = useEditor({initialContent: note.body, editable: isEdit});

  useEffect(() => {
    const conditionalProps = isEdit
      ? {
          isInput: true,
          inputValue: note.title,
          autoFocus: true,
          inputStyle: {fontSize: 16},
          onChangeInput: (value: string) => {
            onChangeInput(value);
          },
          leftIcon: (
            <IconButton
              onPress={async () => {
                const body = await editor.getJSON();
                if (note.title === '' || Object.keys(body).length === 0) return;
                const noteToSave = {
                  ...note,
                  body,
                  modifiedDate: new Date().getTime().toString(),
                };
                setIsEdit(false);
                onSaveNote(noteToSave);
              }}
              icon={<CustomIcon name={icons.save.name} size={icons.save.size} color={colors.text} />}
            />
          ),
        }
      : {
          title: note.title,
          titleStyle: {flex: 1, color: colors.text, fontSize: 16},
          leftIcon: (
            <IconButton
              onPress={() => setIsEdit(true)}
              icon={<CustomIcon name={icons.create.name} size={icons.create.size} color={colors.text} />}
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
              icon={<CustomIcon name={icons.back.name} size={28} color={colors.text} style={{marginLeft: -8}} />}
            />
          }
        />
      ),
    });

    return () => {};
  }, [note, isEdit]);

  const onChangeInput = (value: string) => {
    setNote(prevNote => ({
      ...prevNote,
      title: value,
    }));
  };

  return <Editor editor={editor} editorStyle={{paddingHorizontal: 20}} />;
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
});
