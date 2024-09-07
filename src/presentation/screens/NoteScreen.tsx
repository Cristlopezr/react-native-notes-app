import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {StyleSheet, Text, View} from 'react-native';
import {RootStackParamList} from '../routes';
import {useEffect, useState} from 'react';
import {CustomHeader, CustomIcon, IconButton, NoteInputView, TextEditAction} from '../components';
import {useEditText, useNotesContext, useThemeContext} from '../hooks';
import {icons} from '../icons';
import {textEditActions} from '../../lib/textEditActions';

type Props = NativeStackScreenProps<RootStackParamList, 'NoteScreen'>;
export const NoteScreen = ({navigation: navigationStack, route}: Props) => {
  const {colors} = useThemeContext();
  const {getNote, onSaveNote} = useNotesContext();

  const [isEdit, setIsEdit] = useState(false);
  const {id} = route.params;
  const {note, onChangeInput, onSelectText, actionsStylesInUse, onClickEditTextAction, stylesIdInUse} = useEditText(
    getNote(id),
  );

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

  return (
    <View style={{flex: 1, marginHorizontal: 25}}>
      {isEdit ? (
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
      ) : (
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {note.body.map(item => (
            <Text key={item.id} style={[item.style, {color: colors.text}]}>
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
