import React, { useEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { useTransaction } from '../hooks/useTransaction'
import { gql, useQuery, useSubscription,ApolloProvider,ApolloClient,InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    cache: new InMemoryCache()
  });

const QUERY_ALL_TRANSACTIONS = gql`
query Transactions {
  transactions {
    ... on TransactionsErrorResult {
      message
      statusCode
    }
    ... on TransactionsSuccessfulResult {
      transactions {
        id
        account_id
        amount
        created_at
        updated_at
      }
    }
  }
}
`

const CREATE_TRANSACTION_SUBSCRIPTION = gql`
subscription Subscription {
  transactionCreated {
    account_id
    amount
  }
}
`

function TransactionList() {


    const { loading, error, data, refetch } = useQuery(QUERY_ALL_TRANSACTIONS);
    const transactionHook = useTransaction();
    const { data:SubscriptionData, loading:subscriptionLoading, error:subscriptionError } = useSubscription(CREATE_TRANSACTION_SUBSCRIPTION,{
        onSubscriptionData:(data)=>{
            console.warn("here")
            refetch();
        }
    })
    if(SubscriptionData)
    {
        console.log(SubscriptionData)
    }
    if(subscriptionError)
    {
        console.log("èèrror",subscriptionError)
    }

    useEffect(() => {
        refetch();
    }, [])


    return (
        <View>
            <ApolloProvider client={client}>
            <ScrollView style={{ padding: 10 }}>
                {data !== undefined && 
                data.transactions.transactions.map(({ id, amount, created_at }, index) => (
                    <View style={{ marginTop: 10, backgroundColor: "#E6E6FA", width: "90%", alignSelf: "center", paddingHorizontal: 25, paddingVertical: 5 }} key={index}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={{ fontWeight: "bold", marginRight: 10 }}>ID: </Text>
                                <Text>{id}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => transactionHook.deleteTransaction(id)}
                                style={{ marginLeft: "auto", justifyContent: "center", paddingTop: 10 }}>
                                <FontAwesome name="trash" size={24} color="#8B0000" />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={{ fontWeight: "bold", marginRight: 10 }}>Balance: </Text>
                            <Text>{amount}</Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                            <Text style={{ fontWeight: "bold", marginRight: 10 }}>Date: </Text>
                            <Text>{created_at}</Text>
                        </View>
                    </View>
                ))}
                <View style={{height:300}}><Text> </Text></View>
            </ScrollView>
            </ApolloProvider>
        </View>

    )
}

export default TransactionList