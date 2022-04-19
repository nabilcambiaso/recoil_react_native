import Main from './src/Main';
import { RecoilRoot } from 'recoil';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TransactionList from './src/views/TransactionList';
import AddTransaction from './src/views/AddTransaction';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

// Initialize Apollo Client
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
});

export default function App() {

  const Stack = createNativeStackNavigator();

  return (
    <RecoilRoot>
      <ApolloProvider client={client}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Main'>
            <Stack.Screen name="Main" component={Main} />
            <Stack.Screen name="AddTransaction" component={AddTransaction} />
            <Stack.Screen name="TransactionList" component={TransactionList} />
          </Stack.Navigator>
        </NavigationContainer>
      </ApolloProvider>
    </RecoilRoot>
  );
}


