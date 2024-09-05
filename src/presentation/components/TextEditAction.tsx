import {StyleProp, Text, TextStyle, TouchableOpacity, View} from 'react-native';

interface Props {
  text: string;
  actionName: string;
  onPress: () => void;
  style?: StyleProp<TextStyle>;
  color: string;
}

export const TextEditAction = ({text, actionName, onPress, style, color}: Props) => {
  return (
    <TouchableOpacity key={actionName} onPress={onPress}>
      <Text style={[{fontSize: 20, color}, style]}>{text}</Text>
    </TouchableOpacity>
  );
};
