import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import loginScreen from '@/components/screens/loginScreen';
import registerScreen from '@/components/screens/registerScreen';
import ForgotPassword from '@/components/screens/ForgotPassword';

export type RootStackParamList = {
  login: undefined;
  register: undefined;
  ForgotPassword: undefined;
};


const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    // עוטף את כל האפליקציה, מספק מידע אודות החיבור של המשתמש
        <Stack.Navigator initialRouteName="login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" component={loginScreen} />
          <Stack.Screen name="register" component={registerScreen} />
          {/* <Stack.Screen name="ForgotPassword" component={ForgotPassword} /> */}
        </Stack.Navigator>
  );
}

