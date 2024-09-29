import {
  PlaceholderBridge,
  useEditorBridge,
  TenTapStartKit,
  useBridgeState,
  CodeBridge,
  darkEditorTheme,
  defaultEditorTheme,
} from '@10play/tentap-editor';
import {useThemeContext} from './useThemeContext';

interface Props {
  initialContent: Record<string, any>;
  editable?: boolean;
}

export const useEditor = ({initialContent, editable = true}: Props) => {
  const {colors, dark} = useThemeContext();

  const customCodeBlockCSS = `
  * {
      color: ${colors.text};
  }
  `;

  const editor = useEditorBridge({
    theme: dark ? darkEditorTheme : defaultEditorTheme,
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent: initialContent,
    editable,
    bridgeExtensions: [
      ...TenTapStartKit,
      PlaceholderBridge.configureExtension({
        placeholder: 'Escribe algo...',
      }),
      CodeBridge.configureCSS(customCodeBlockCSS),
    ],
  });

  const editorState = useBridgeState(editor);

  return {editor, editorState};
};
