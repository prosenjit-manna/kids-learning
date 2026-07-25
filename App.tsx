/**
 * Kids Learning App
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screen/HomeScreen';
import CategoryDetailsScreen from './screen/CategoryDetailsScreen';
import SettingsScreen from './screen/SettingsScreen';

export type RootStackParamList = {
  Home: undefined;
  CategoryDetails: { category: string };
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFBF0" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: '#FFFBF0' },
            headerTintColor: '#333',
            headerTitleStyle: { fontWeight: '800', fontSize: 20 },
          }}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Kids Learning 🎒', headerShown: false }}
          />
          <Stack.Screen
            name="CategoryDetails"
            component={CategoryDetailsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
