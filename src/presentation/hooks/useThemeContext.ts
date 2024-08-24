import {useContext} from 'react';
import {ThemeContext} from '../contexts/ThemeContext';

export const useThemeContext = () => {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('ThemeContext should be used within ThemeContextProvider');
  }
  return theme;
};
