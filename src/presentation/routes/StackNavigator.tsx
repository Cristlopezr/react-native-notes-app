import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NewNoteScreen, NoteScreen, NotesScreen, SearchScreen} from '../screens';
import {useThemeContext} from '../hooks';

export type RootStackParamList = {
  NotesScreen: undefined;
  NewNoteScreen: undefined;
  SearchScreen: undefined;
  NoteScreen: {id: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const StackNavigator = () => {
  const {colors} = useThemeContext();

  return (
    <Stack.Navigator
      screenOptions={{
        animation: 'slide_from_right',
        headerTintColor: colors.text,
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: colors.background,
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}>
      <Stack.Screen
        name="NotesScreen"
        component={NotesScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen name="NewNoteScreen" component={NewNoteScreen} />
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{headerTitle: ''}}
      />
      <Stack.Screen name="NoteScreen" component={NoteScreen} />
    </Stack.Navigator>
  );
};
