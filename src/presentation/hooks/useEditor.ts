import {useEditorBridge} from '@10play/tentap-editor';

interface Props {
  initialContent: Record<string, any>;
  editable?: boolean;
}

export const useEditor = ({initialContent, editable = true}: Props) => {
  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent: initialContent,
    editable,
  });

  return {editor};
};
