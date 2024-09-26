import {EditorBridge, RichText, Toolbar} from '@10play/tentap-editor';
import React from 'react';
import {KeyboardAvoidingView, Platform, StyleProp, View, ViewStyle} from 'react-native';
import {useThemeContext} from '../hooks';

interface Props {
  editor: EditorBridge;
  editorStyle?: StyleProp<ViewStyle>;
}

export const Editor = ({editor, editorStyle}: Props) => {
  const {colors} = useThemeContext();

  return (
    <>
      <View style={[{flex: 1}, editorStyle]}>
        <RichText editor={editor} style={{backgroundColor: colors.background}} />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          position: 'absolute',
          width: '100%',
          bottom: 0,
        }}>
        <Toolbar editor={editor} />
      </KeyboardAvoidingView>
    </>
  );
};
