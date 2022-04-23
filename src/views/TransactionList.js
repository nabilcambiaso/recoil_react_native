import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { gql, useQuery, useMutation, useSubscription, ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import NetInfo from '@react-native-community/netinfo';
//redux
import { connect } from 'react-redux';
import { AddTransactions, ClearTransactions } from '../redux/actions/transactionAction';

const client = new ApolloClient({
    uri: 'http://192.168.1.102:4000/graphql',
    cache: new InMemoryCache()
});

const CREATE_TRANSACTION_MUTATION = gql`
mutation CreateTransaction($input: createTransactionInput!) {
  createTransaction(input: $input) {
    id
    account_id
    amount
  }
}
`
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

function TransactionList(props) {

    const { loading, error, data, refetch } = useQuery(QUERY_ALL_TRANSACTIONS);
    const [createTransaction, { error: mutationError }] = useMutation(CREATE_TRANSACTION_MUTATION)

    const [isOffline, setOfflineStatus] = useState(false);

    useEffect(() => {
        console.log("first")
        NetInfo.addEventListener(async (state) => {
            const offline = !(state.isConnected && state.isInternetReachable);
            setOfflineStatus(offline);
            if (!offline) {
                if (data) {
                    var offline_transactions = props.transactionState.transactions.filter(function (tr) {
                        return tr.is_offline == "true"
                    });
                    // var online_transactions = props.transactionState.transactions.filter(function (tr) {
                    //     return tr.is_offline != "true"
                    // });
                    props.ClearTransactions();
                    //  props.AddTransactions(online_transactions);
                    offline_transactions.forEach(element => {
                        var account_id = element.account_id;
                        var amount = element.amount
                        createTransaction({
                            variables: {
                                input: {
                                    account_id,
                                    amount
                                }
                            }
                        })
                    });

                    props.AddTransactions(data.transactions.transactions)
                }
            }
        });
    }, [isOffline,props.transactionState.transactions.length]);


    const { data: SubscriptionData, loading: subscriptionLoading, error: subscriptionError } = useSubscription(CREATE_TRANSACTION_SUBSCRIPTION, {
        onSubscriptionData: (data) => {
            refetch();
        }
    })
    if (SubscriptionData) {
        // console.log(SubscriptionData)
    }
    if (subscriptionError) {
        // console.log("èèrror", subscriptionError)
    }

    useEffect(() => {
        refetch();
    }, [])
    //console.log(props.transactionState.transactions)

    return (
        <View>
            <ApolloProvider client={client}>
                <ScrollView style={{ padding: 10 }}>
                    {
                        props.transactionState.transactions.length != 0 && props.transactionState.transactions.map(({ id, amount, created_at }, index) => (
                            <View style={{ marginTop: 10, backgroundColor: "#E6E6FA", width: "90%", alignSelf: "center", paddingHorizontal: 25, paddingVertical: 5 }} key={index}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Text style={{ fontWeight: "bold", marginRight: 10 }}>ID: </Text>
                                        <Text>{id}</Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => { }}
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
                    <View style={{ height: 300 }}><Text> </Text></View>
                </ScrollView>
            </ApolloProvider>
        </View>

    )
}

const mapStatetoProps = (state) => {
    return {
        transactionState: state.transactionReducer,
    }
}
const mapDispatchtoProps = (dispatch) => {
    return {
        AddTransactions: (transactions) => dispatch(AddTransactions(transactions)),
        ClearTransactions: () => dispatch(ClearTransactions()),
    }
}
export default connect(mapStatetoProps, mapDispatchtoProps)(TransactionList);
