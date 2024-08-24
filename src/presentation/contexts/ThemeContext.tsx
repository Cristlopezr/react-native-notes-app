import {createContext, useEffect} from 'react';
import {useColorScheme} from 'react-native';
import {darkTheme, lightTheme} from '../theme/theme';
import {readAndSetTheme} from '../theme';

type theme = {
  dark: boolean;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
    action: string;
    lightText: string;
  };
};

type themeContextProviderProps = {
  children: React.ReactNode;
};

export const ThemeContext = createContext<null | theme>(null);

const getTheme = async () => {
  await readAndSetTheme();
};

export const ThemeContextProvider = ({children}: themeContextProviderProps) => {
  useEffect(() => {
    getTheme();
  }, []);

  const scheme = useColorScheme();
  const theme = scheme === 'light' ? lightTheme : darkTheme;
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};
