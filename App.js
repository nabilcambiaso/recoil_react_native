import Main from './src/Main';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TransactionList from './src/views/TransactionList';
import AddTransaction from './src/views/AddTransaction';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, split } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities'
import { useNetInfo } from '@react-native-community/netinfo';
var Environment = require('./environment');
//recoil
import { RecoilRoot } from 'recoil';
//redux
import { Provider } from 'react-redux';
import stores from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
const { store, persistor } = stores();

//create http link
const httpLink = new HttpLink({
  uri: `http://localhost:4000/graphql`
})

// create web socket link
const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/graphql',
  options: {
    reconnect: true
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
  const netinfo = useNetInfo();
  console.warn(netinfo.isInternetReachable?"connected":"lost connection")
  return (
    // <RecoilRoot>
    <Provider store={store}>
      <PersistGate
        loading={null} persistor={persistor}
      >
        <ApolloProvider client={client}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName='AddTransaction'>
              <Stack.Screen name="AddTransaction" component={AddTransaction} />
              <Stack.Screen name="TransactionList" component={TransactionList} />
            </Stack.Navigator>
          </NavigationContainer>
        </ApolloProvider>
      </PersistGate>
    </Provider>
    // </RecoilRoot>
  );
}


