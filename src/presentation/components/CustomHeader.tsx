import {
  ColorValue,
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputChangeEventData,
  TextStyle,
  View,
} from 'react-native';

interface Props {
  backButton?: React.ReactNode;
  leftIcon?: React.ReactNode[] | React.ReactNode;
  inputPlaceHolder?: string;
  autoFocus?: boolean;
  isInput?: boolean;
  title?: string;
  placeHolderTextColor?: ColorValue;
  inputStyle?: StyleProp<TextStyle>;
  backgroundColor?: string;
  titleStyle?: StyleProp<TextStyle>;
  inputValue?: string;
  onChangeInput?: (value: string) => void;
}

export const CustomHeader = ({
  backButton,
  leftIcon,
  inputPlaceHolder,
  placeHolderTextColor,
  autoFocus,
  inputStyle,
  backgroundColor,
  isInput,
  title,
  titleStyle,
  inputValue = '',
  onChangeInput,
}: Props) => {
  return (
    <View style={[styles.container, {backgroundColor}]}>
      {backButton && backButton}
      {title && <Text style={titleStyle}>{title}</Text>}
      {isInput && (
        <TextInput
          placeholder={inputPlaceHolder}
          placeholderTextColor={placeHolderTextColor}
          autoFocus={autoFocus}
          style={[{flex: 1}, inputStyle]}
          value={inputValue}
          onChangeText={onChangeInput}
        />
      )}
      {leftIcon ||
        (Array.isArray(leftIcon) &&
          (Array.isArray(leftIcon)
            ? leftIcon.map((icon, i) => <View key={i}>{icon}</View>)
            : leftIcon))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingVertical: 20,
    gap: 15,
  },
});
