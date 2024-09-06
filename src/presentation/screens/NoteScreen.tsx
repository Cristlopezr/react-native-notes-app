import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputSelectionChangeEventData,
  TextStyle,
  View,
} from 'react-native';
import {RootStackParamList} from '../routes';
import {useEffect, useState} from 'react';
import {CustomHeader, CustomIcon, IconButton, NoteInputView} from '../components';
import {useNotesContext, useThemeContext} from '../hooks';
import {icons} from '../icons';
import {Note, NoteBody} from '../contexts';
import {textEditActions} from '../../lib/textEditActions';
import {convertStyleToObject} from '../helpers';

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
  const [selection, setSelection] = useState<{start: number; end: number}>();
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
                if (note.title === '' || note.body.length === 0) return;
                const noteToSave = {
                  ...note,
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

  const onSelectText = ({nativeEvent: {selection}}: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
    setSelection(selection);

    const body = note.body.filter(item => Number(item.id) >= selection.start && Number(item.id) <= selection.end);

    const usedStylesIds = body.map(item => item.stylesId);

    /* 
    const itemStylesKeys = body.map(item => Object.keys(convertStyleToObject(item.styles)));

    const actionStyleKeys = textEditActions.map(({style}) => Object.keys(convertStyleToObject(style)))

    const isActionActive = itemStylesKeys.some((key) => {


    })

    const isActive = itemStylesKeys.some((key) => {
      if(actionStyleKeys.includes(key)){
        return true
      }
    }) */
  };

  const onClickEditTextAction = (style: StyleProp<TextStyle>) => {
    if (!selection?.end) {
      return;
    }
    const body = note.body.map<NoteBody>(item => {
      if (Number(item.id) >= selection.start && Number(item.id) <= selection.end) {
        //Borrar los estilos si estan siendo utilizados
        const currentStyles = convertStyleToObject(item.styles);

        const additionalStyles = convertStyleToObject(style);

        return {
          ...item,
          styles: {...currentStyles, ...additionalStyles},
        };
      }
      return item;
    });
    setNote(prevNote => ({
      ...prevNote,
      body,
    }));
  };

  return (
    <View style={{flex: 1, marginHorizontal: 25}}>
      {isEdit ? (
        <NoteInputView note={note} onChangeInput={onChangeInput} onSelectText={onSelectText} />
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
