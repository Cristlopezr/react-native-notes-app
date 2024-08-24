import {FlatList, StyleSheet, Text, View} from 'react-native';
import {
  CustomHeader,
  CustomIcon,
  IconButton,
  Note,
  RecentSearches,
} from '../components';
import texts from '../../locales/es';
import {useEffect, useState} from 'react';
import {useNotesContext, useThemeContext} from '../hooks';
import {icons} from '../icons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../routes';
import {Note as NoteInterface} from '../contexts';

type Props = NativeStackScreenProps<RootStackParamList, 'SearchScreen'>;

export const SearchScreen = ({navigation}: Props) => {
  const {colors} = useThemeContext();
  const {notes} = useNotesContext();
  const [filteredNotes, setFilteredNotes] = useState<NoteInterface[]>([]);
  const [search, setSearch] = useState('');

  const onChangeInput = (value: string) => {
    setSearch(value);
    const newFilteredNotes = notes.filter(note =>
      note.title.toUpperCase().includes(value.toUpperCase()),
    );
    setFilteredNotes(newFilteredNotes);
  };

  useEffect(() => {
    navigation.setOptions({
      header: ({navigation}) => (
        <CustomHeader
          inputPlaceHolder={texts.searchInputPlaceholder}
          placeHolderTextColor={colors.lightText}
          inputStyle={{fontSize: 30, fontWeight: '500'}}
          autoFocus
          inputValue={search}
          isInput
          onChangeInput={onChangeInput}
          backgroundColor={colors.background}
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
              onPress={() => {}}
              icon={
                <CustomIcon
                  name={icons.mic.name}
                  size={icons.mic.size}
                  color={colors.text}
                />
              }
            />
          }
        />
      ),
    });
  }, [search]);

  if (search !== '') {
    return (
      <View style={{flex: 1, paddingTop: 20, paddingHorizontal: 30}}>
        {filteredNotes.length > 0 ? (
          <FlatList
            data={filteredNotes}
            renderItem={({item}) => (
              <Note
                note={item}
                onPress={() => navigation.navigate('NoteScreen', {id: item.id})}
              />
            )}
            keyExtractor={item => item.id}
          />
        ) : (
          <View>
            <Text style={{textAlign: 'center'}}>{texts.noResults}</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Buscar cualquier nota</Text>
    </View> /*  <RecentSearches /> */
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
});
