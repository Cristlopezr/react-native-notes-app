import {Styles} from '../presentation/components';

export interface TextEditActions {
  id: number;
  text: string;
  actionName: string;
  style?: Styles;
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
