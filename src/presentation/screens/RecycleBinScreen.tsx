import {FlatList, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {icons} from '../icons';
import {useNotesContext, useThemeContext} from '../hooks';
import {IconButton, Note, Title} from '../components';
import {CustomIcon} from '../components/CustomIcon';
import {DrawerScreenProps} from '@react-navigation/drawer';
import {RootDrawerParamsList} from '../routes';
import {TouchableOpacity} from 'react-native-gesture-handler';

type Props = DrawerScreenProps<RootDrawerParamsList, 'RecycleBinScreen'>;

export const RecycleBinScreen = ({navigation}: Props) => {
  const {colors} = useThemeContext();
  const {notesInRecycleBin} = useNotesContext();

  return (
    <SafeAreaView style={[styles.container]}>
      <Title
        title="Papelera"
        subtitle={`${notesInRecycleBin.length} ${
          notesInRecycleBin.length === 1 ? 'nota' : 'notas'
        }`}
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
            onPress={() => navigation.openDrawer()}
            icon={
              <CustomIcon
                name={icons.menu.name}
                size={icons.menu.size}
                color={colors.text}
              />
            }
          />
         {/*  <View style={[styles.row, styles['gap-15']]}>
            <TouchableOpacity onPress={() => {}}>
              <Text style={{color: colors.text}}>Editar</Text>
            </TouchableOpacity>
            <CustomIcon
              name={icons.ellipsis.name}
              size={icons.ellipsis.size}
              color={colors.text}
            />
          </View> */}
        </View>
      </View>
      <View style={{marginBottom: 25}}>
        {notesInRecycleBin.length > 0 ? (
          <Text style={{color: colors.text}}>
            Los elementos muestran cuantos dias faltan para que se eliminen para
            siempre.
          </Text>
        ) : (
          <Text style={{textAlign: 'center', color: colors.text}}>
            No hay elementos en la papelera.
          </Text>
        )}
      </View>
      {/* Lista de notas de la papelera */}
      <FlatList
        data={notesInRecycleBin}
        renderItem={({item}) => (
          <Note isNoteInRecycleBin note={item} onPress={() => {}} />
        )}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
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
});
