import {StyleProp, TextStyle} from 'react-native';

export const convertStyleToObject = (style: StyleProp<TextStyle>) => {
  return Array.isArray(style) ? Object.assign({}, ...style) : style || {};
};
