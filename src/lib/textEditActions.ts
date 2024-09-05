import {StyleProp, TextStyle} from 'react-native';

interface TextEditActions {
  text: string;
  actionName: string;
  style?: StyleProp<TextStyle>;
}

export const textEditActions: TextEditActions[] = [
  {text: 'B', actionName: 'bold', style: {fontWeight: 'bold'}},
  {
    text: 'I',
    actionName: 'italic',
    style: {fontStyle: 'italic'},
  },
];
