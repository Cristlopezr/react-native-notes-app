import {NavigationContainer} from '@react-navigation/native';
import {DrawerNavigator} from './presentation/routes';
import {
  NoteContextProvider,
  ThemeContextProvider,
} from './presentation/contexts';

export const NotesApp = () => {
  return (
    <NavigationContainer>
      <ThemeContextProvider>
        <NoteContextProvider>
          <DrawerNavigator />
        </NoteContextProvider>
      </ThemeContextProvider>
    </NavigationContainer>
  );
};
