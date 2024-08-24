import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {RecycleBinScreen} from '../screens';
import {StackNavigator} from './StackNavigator';
import {CustomIcon} from '../components';
import {icons} from '../icons';
import {useThemeContext} from '../hooks';

export type RootDrawerParamsList = {
  StackNavigator: undefined;
  RecycleBinScreen: undefined;
};

const Drawer = createDrawerNavigator<RootDrawerParamsList>();

export const DrawerNavigator = () => {
  const {colors} = useThemeContext();
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveBackgroundColor: colors.border,
        drawerActiveTintColor: colors.text,
        drawerInactiveTintColor: colors.text,
        drawerStyle: {
          backgroundColor: colors.background,
          paddingHorizontal: 10,
          paddingVertical: 20,
        },
        sceneContainerStyle: {
          backgroundColor: colors.background,
        },
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="StackNavigator"
        component={StackNavigator}
        options={{
          title: 'Todas las notas',
          headerShown: false,
          drawerIcon: ({color}) => (
            <CustomIcon
              name={icons.document.name}
              color={color}
              size={icons.document.size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="RecycleBinScreen"
        component={RecycleBinScreen}
        options={{
          title: 'Papelera',
          headerShown: false,
          drawerIcon: ({color}) => (
            <CustomIcon
              name={icons.bin.name}
              color={color}
              size={icons.bin.size}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

function CustomDrawerContent(props: DrawerContentComponentProps) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}
