import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useThemeContext} from '../hooks';
import {IconButton} from './IconButton';
import {CustomIcon} from './CustomIcon';
import {icons} from '../icons';
import texts from '../../locales/es';

export const RecentSearches = () => {
  const {colors} = useThemeContext();
  return (
    <View style={styles.container}>
      <Text>{texts.recentSearches}</Text>
      <View>
        <View
          style={[styles.searchItem, {borderBottomColor: colors.lightText}]}>
          <Text style={{color: colors.text}}>nombreBusqueda</Text>
          <View style={styles.searchItemDetails}>
            <Text>12:34</Text>
            <IconButton
              onPress={() => {}}
              icon={
                <CustomIcon
                  name={icons.delete.name}
                  size={icons.delete.size}
                  color={colors.text}
                />
              }
            />
          </View>
        </View>
        <Pressable onPress={() => {}} style={styles.deleteAllButton}>
          <Text style={[styles.deleteAllButtonText, {color: colors.text}]}>
            {texts.recentSearchesDeleteAll}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {paddingHorizontal: 25},
  searchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    borderBottomWidth: 0.3,
    paddingBottom: 20,
  },
  searchItemDetails: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  deleteAllButton: {marginTop: 20},
  deleteAllButtonText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});
