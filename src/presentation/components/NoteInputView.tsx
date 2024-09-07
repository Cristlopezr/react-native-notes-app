import {
  NativeSyntheticEvent,
  StyleProp,
  Text,
  TextInput,
  TextInputSelectionChangeEventData,
  TextStyle,
  View,
} from 'react-native';
import React from 'react';
import {textEditActions} from '../../lib/textEditActions';
import {TextEditAction} from './TextEditAction';
import {Note} from '../contexts';

interface Props {
  onSelectText: ({nativeEvent: {selection}}: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => void;
  onChangeInput: (value: string, field: string) => void;
  note: Note;
}

export const NoteInputView = ({onSelectText, note, onChangeInput}: Props) => {
  return (
    <View style={{flex: 1, marginHorizontal: 25}}>
      <TextInput
        onSelectionChange={onSelectText}
        onChangeText={(value: string) => onChangeInput(value, 'body')}
        multiline
        autoFocus
        style={{
          flex: 1,
          textAlignVertical: 'top',
        }}>
        {note.body.map(item => (
          <Text key={item.id} style={item.style}>
            {item.text}
          </Text>
        ))}
      </TextInput>
    </View>
  );
};
