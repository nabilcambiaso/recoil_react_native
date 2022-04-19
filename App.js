import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Main from './src/Main';
import {RecoilRoot} from 'recoil';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TransactionList from './src/views/TransactionList';
import AddTransaction from './src/views/AddTransaction';

export default function App() {

  const Stack = createNativeStackNavigator();

  return (
    <RecoilRoot>
     <NavigationContainer>
     <Stack.Navigator initialRouteName='Main'>
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="AddTransaction" component={AddTransaction} />
        <Stack.Screen name="TransactionList" component={TransactionList} />
      </Stack.Navigator>
    </NavigationContainer> 
    </RecoilRoot>
  );
}


