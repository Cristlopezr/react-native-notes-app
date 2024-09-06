import {StyleProp, TextStyle} from 'react-native';

interface TextEditActions {
  id: number;
  text: string;
  actionName: string;
  style?: StyleProp<TextStyle>;
}

export const textEditActions: TextEditActions[] = [
  {id: 0, text: 'B', actionName: 'bold', style: {fontWeight: 'bold'}},
  {
    id: 1,
    text: 'I',
    actionName: 'italic',
    style: {fontStyle: 'italic'},
  },
];
