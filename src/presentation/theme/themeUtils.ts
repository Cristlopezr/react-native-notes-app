import AsyncStorage from '@react-native-async-storage/async-storage';
import {Appearance} from 'react-native';

export const readAndSetTheme = async () => {
  try {
    const value = await AsyncStorage.getItem('theme');
    if (value !== null) {
      setTheme(value as 'light' | 'dark');
    }
  } catch (e) {
    console.log(e);
    setTheme('light');
  }
};

export const storeAndSetTheme = async (value: 'light' | 'dark') => {
  try {
    setTheme(value);
    await AsyncStorage.setItem('theme', value);
  } catch (e) {
    console.log(e);
  }
};

export const setTheme = (theme: 'light' | 'dark') => {
  Appearance.setColorScheme(theme);
};
