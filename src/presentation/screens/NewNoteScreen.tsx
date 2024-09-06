import {useEffect, useState} from 'react';
import {NativeSyntheticEvent, StyleProp, TextInputSelectionChangeEventData, TextStyle, View} from 'react-native';
import {CustomHeader, CustomIcon, IconButton, NoteInputView, TextEditAction} from '../components';
import texts from '../../locales/es';
import {useNotesContext, useThemeContext} from '../hooks';
import {icons} from '../icons';
import {NativeStackNavigationProp, NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../routes';
import {ParamListBase} from '@react-navigation/native';
import {Note, NoteBody} from '../contexts';
import {convertStyleToObject} from '../helpers';
import {textEditActions} from '../../lib/textEditActions';

type Props = NativeStackScreenProps<RootStackParamList, 'NewNoteScreen'>;

export const NewNoteScreen = ({navigation}: Props) => {
  const {colors} = useThemeContext();
  const {onSaveNote} = useNotesContext();
  const [usedStylesIds, setUsedStylesIds] = useState<number[]>([]);
  const [note, setNote] = useState<Note>({
    body: [{id: '', text: '', styles: {}}],
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

  const onClickEditTextAction = (style: StyleProp<TextStyle>, id: number) => {
    if (!selection || selection.start === note.body.length) {
      return;
    }

    //Revisar si en todos esta el estilo en uso con every
    const isStyleAlreadyInUse = note.body
      .filter(item => Number(item.id) >= selection.start && Number(item.id) <= selection.end)
      .every(item => item.stylesId?.includes(id));

    const body = note.body.map<NoteBody>(item => {
      if (Number(item.id) >= selection.start && Number(item.id) <= selection.end) {
        let currentStyles = convertStyleToObject(item.styles);
        const additionalStyle = convertStyleToObject(style);

        if (isStyleAlreadyInUse) {
          const {[Object.keys(additionalStyle)[0]]: _, ...newStyles} = currentStyles;
          currentStyles = newStyles;
        }

        let stylesId: number[] = [];
        if (item.stylesId) {
          stylesId = isStyleAlreadyInUse ? item.stylesId.filter(styleId => styleId !== id) : [...item.stylesId, id];
        } else {
          stylesId = [id];
        }

        return {
          ...item,
          styles: isStyleAlreadyInUse ? {...currentStyles} : {...currentStyles, ...additionalStyle},
          stylesId: stylesId,
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
    <>
      <NoteInputView
        note={note}
        onChangeInput={onChangeInput}
        onSelectText={onSelectText}
      />
      <View style={{padding: 20, marginBottom: 20, flexDirection: 'row', gap: 10}}>
        {textEditActions.map(({actionName, text, style, id}) => (
          <TextEditAction
            key={actionName}
            text={text}
            style={style}
            isActive={usedStylesIds.includes(id)}
            activeColorBg={colors.border}
            color={colors.text}
            onPress={() => onClickEditTextAction(style, id)}
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
