import {StyleProp, Text, TextStyle, TouchableOpacity, View, ViewStyle} from 'react-native';

interface Props {
  text: string;
  onPress: () => void;
  style?: StyleProp<TextStyle>;
  color: string;
  activeColorBg: string;
  isActive: boolean;
}

export const TextEditAction = ({text, onPress, style, color, isActive, activeColorBg}: Props) => {
  const activeStyles: StyleProp<ViewStyle> = {
    backgroundColor: activeColorBg,
    borderRadius: 100,
  };

  return (
    <TouchableOpacity
      style={[
        {
          paddingVertical: 5,
          paddingHorizontal: 10,
          minHeight: 50,
          minWidth: 50,
          justifyContent: 'center',
          alignItems: 'center',
        },
        isActive && activeStyles,
      ]}
      onPress={onPress}>
      <Text style={[{fontSize: 20, color}, style]}>{text}</Text>
    </TouchableOpacity>
  );
};
