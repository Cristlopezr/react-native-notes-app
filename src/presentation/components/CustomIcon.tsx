import {StyleProp, TextStyle} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface CustomIconProps {
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export const CustomIcon = ({
  name,
  size = 28,
  color = 'black',
  style,
}: CustomIconProps) => {
  return <Icon name={name} size={size} color={color} style={style} />;
};
