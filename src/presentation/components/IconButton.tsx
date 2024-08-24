import {Pressable, StyleProp, TouchableOpacity, ViewStyle} from 'react-native';

interface IconButtonProps {
  onPress: () => void;
  icon: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const IconButton = ({onPress, icon, style}: IconButtonProps) => {
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      {icon}
    </TouchableOpacity>
  );
};
