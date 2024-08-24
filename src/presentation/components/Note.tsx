import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNotesContext, useThemeContext} from '../hooks';
import {Note as NoteInterface} from '../contexts';
import {formatDate, getDaysLeftToDelete} from '../helpers';
import {IconButton} from './IconButton';
import {CustomIcon} from './CustomIcon';
import {icons} from '../icons';

type NoteProps = {
  onPress: () => void;
  note: NoteInterface;
  hasinput?: boolean;
  isNoteInRecycleBin?: boolean;
  isSelected:boolean;
};

export const Note = ({
  onPress,
  hasinput,
  note,
  isNoteInRecycleBin,
  isSelected
}: NoteProps) => {
  const {colors} = useThemeContext();

  const {
    onDeleteNoteFromRecybleBin,
    onRestoreNoteFromRecycleBin,
    onSetNotesToDelete,
  } = useNotesContext();

  const onPressNote = () => {
    if (hasinput) {
      onSetNotesToDelete(note);
      return;
    }
    onPress();
  };

  return (
    <NoteLayout
      isNoteInRecycleBin={isNoteInRecycleBin}
      onPressNote={onPressNote}>
      {hasinput && (
        <View
          style={[
            styles.checkbox,
            isSelected && {backgroundColor: colors.action},
            {borderColor: colors.lightText},
          ]}>
          <View
            style={[
              styles.checkmark,
              isSelected && {backgroundColor: colors.action},
            ]}
          />
        </View>
      )}
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View>
          <Text style={{fontWeight: 'bold', color: colors.text}}>
            {note.title.length >= 15
              ? `${note.title.slice(0, 15)}...`
              : note.title}
          </Text>
          {isNoteInRecycleBin ? (
            <Text>{getDaysLeftToDelete(note.createdDate)}</Text>
          ) : (
            <Text style={{color: colors.lightText}}>
              {formatDate(note.createdDate)}
            </Text>
          )}
        </View>
        {isNoteInRecycleBin && (
          <View style={{flexDirection: 'row', gap: 20, alignItems: 'center'}}>
            <IconButton
              onPress={() => onRestoreNoteFromRecycleBin(note)}
              icon={
                <CustomIcon
                  style={{padding: 2}}
                  name={icons.undo.name}
                  size={icons.undo.size}
                  color={colors.text}
                />
              }
            />
            {/* Mostrar alerta antes de borrar */}
            <IconButton
              onPress={() => {
                Alert.alert(
                  'Eliminar nota',
                  'La nota se eliminara para siempre.',
                  [
                    {
                      text: 'Cancelar',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    {
                      text: 'Eliminar',
                      onPress: () => onDeleteNoteFromRecybleBin(note.id),
                    },
                  ],
                );
              }}
              icon={
                <CustomIcon
                  style={{padding: 2}}
                  name={icons.delete.name}
                  size={icons.delete.size}
                  color={colors.text}
                />
              }
            />
          </View>
        )}
      </View>
    </NoteLayout>
  );
};

type NoteLayoutProps = {
  children: React.ReactNode;
  isNoteInRecycleBin: boolean | undefined;
  onPressNote: () => void;
};

const NoteLayout = ({
  children,
  isNoteInRecycleBin,
  onPressNote,
}: NoteLayoutProps) => {
  if (isNoteInRecycleBin) {
    return <View style={[styles.container]}>{children}</View>;
  }
  return (
    <TouchableOpacity style={[styles.container]} onPress={onPressNote}>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 30,
    marginVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
});
