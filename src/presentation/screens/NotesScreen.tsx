import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {icons} from '../icons';
import {useThemeContext, useNotesContext} from '../hooks';
import {IconButton, Note, Title} from '../components';
import {CustomIcon} from '../components/CustomIcon';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../routes';
import {DrawerActions, useFocusEffect} from '@react-navigation/native';
import {storeAndSetTheme} from '../theme';
import {useCallback, useState} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';

type Props = NativeStackScreenProps<RootStackParamList, 'NotesScreen'>;

export const NotesScreen = ({navigation}: Props) => {
  const {notes, onSetNotesToDelete, notesToDelete, onSendNotesToRecycleBin} =
    useNotesContext();
  const {colors, dark} = useThemeContext();
  const [isEditView, setIsEditView] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsEditView(false);
      return () => {};
    }, []),
  );

  return (
    <SafeAreaView style={[styles.container]}>
      <IconButton
        onPress={() => {
          storeAndSetTheme(dark ? 'light' : 'dark');
        }}
        icon={
          !dark ? (
            <CustomIcon
              name={icons.lightTheme.name}
              size={icons.lightTheme.size}
              color={colors.text}
            />
          ) : (
            <CustomIcon
              name={icons.moonTheme.name}
              size={icons.moonTheme.size}
              color={colors.text}
            />
          )
        }
        style={{position: 'absolute', right: 20, top: 20}}
      />
      <Title
        title="Carpetas"
        subtitle={`${notes?.length} ${notes?.length === 1 ? 'nota' : 'notas'}`}
        titleStyle={{color: colors.text}}
        subtitleStyle={{color: colors.text}}
      />
      {/* Menu de acciones */}
      <View style={{paddingBottom: 30}}>
        <View
          style={[
            styles.row,
            styles.justifyBetween,
            styles.alingCenter,
            {paddingBottom: 20},
          ]}>
          <IconButton
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            icon={
              <CustomIcon
                name={icons.menu.name}
                size={icons.menu.size}
                color={colors.text}
              />
            }
          />
          <View style={[styles.row, styles['gap-15']]}>
            <IconButton
              onPress={() => navigation.navigate('SearchScreen')}
              icon={
                <CustomIcon
                  name={icons.search.name}
                  size={icons.search.size}
                  color={colors.text}
                />
              }
            />
            <IconButton
              onPress={() => {
                onSetNotesToDelete(null);
                setIsEditView(!isEditView);
              }}
              icon={
                <CustomIcon
                  name={icons.create.name}
                  size={icons.create.size}
                  color={colors.text}
                />
              }
            />
          </View>
        </View>
        {/* Odenar notas por */}
        <View style={styles.orderBy}>
          <Text style={{textAlignVertical: 'center', color: colors.text}}>
            Fecha de modificación
          </Text>
          <Text
            style={{
              textAlignVertical: 'top',
              fontSize: 18,
              color: colors.text,
            }}>
            |
          </Text>
          <CustomIcon
            name={icons.arrowDown.name}
            size={icons.arrowDown.size}
            color={colors.text}
          />
        </View>
      </View>
      {/* Lista de notas */}
      {notes.length > 0 && (
        <FlatList
          data={notes}
          renderItem={({item}) => (
            <Note
              isSelected={notesToDelete[item.id]?.id === item.id}
              note={item}
              onPress={() => navigation.navigate('NoteScreen', {id: item.id})}
              hasinput={isEditView}
            />
          )}
          keyExtractor={item => item.id}
        />
      )}
      {isEditView && Object.keys(notesToDelete).length > 0 && (
        <TouchableOpacity
          style={{alignItems: 'center'}}
          onPress={() => {
            setIsEditView(false);
            onSendNotesToRecycleBin();
          }}>
          <Text style={{color: colors.text}}>Eliminar</Text>
        </TouchableOpacity>
      )}
      <View
        style={[
          styles.fab,
          {backgroundColor: colors.card, shadowColor: colors.border},
        ]}>
        <IconButton
          onPress={() => navigation.navigate('NewNoteScreen')}
          icon={
            <CustomIcon
              name={icons.create.name}
              size={icons.create.size}
              color={colors.action}
            />
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  orderBy: {flexDirection: 'row', justifyContent: 'flex-end', gap: 10},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  justifyBetween: {
    justifyContent: 'space-between',
  },
  alingCenter: {
    alignItems: 'center',
  },
  'gap-15': {
    gap: 15,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    borderRadius: 40,
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
