import Main from './src/Main';
import { RecoilRoot } from 'recoil';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TransactionList from './src/views/TransactionList';
import AddTransaction from './src/views/AddTransaction';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink,split } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import {getMainDefinition} from '@apollo/client/utilities'

 //create http link
 const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql'
})

// create web socket link
const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/graphql',
 options:{
   reconnect:true
 }
})

// create a split
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

  const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink
})

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


