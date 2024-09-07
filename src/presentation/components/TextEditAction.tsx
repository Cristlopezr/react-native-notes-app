import {StyleProp, Text, TouchableOpacity, View, ViewStyle} from 'react-native';

export interface Styles {
  [key:string]:string;
}

interface Props {
  text: string;
  onPress: () => void;
  style?: Styles;
  color: string;
  activeColorBg: string;
  isActive: boolean | undefined;
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
          minHeight: 40,
          minWidth: 40,
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
