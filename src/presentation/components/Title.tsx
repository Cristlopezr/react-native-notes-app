import {StyleProp, StyleSheet, Text, TextStyle, View} from 'react-native';

interface Props {
  title: string;
  subtitle?: string;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
}

export const Title = ({title, subtitle, titleStyle, subtitleStyle}: Props) => {
  return (
    <View style={styles.titleContainer}>
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      {subtitle && <Text style={subtitleStyle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleContainer: {
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 50,
  },
  title: {
    fontSize: 30,
  },
});
