import React, { useState, useRef, useEffect } from 'react'
import { View, Text, TouchableOpacity, TextInput, FlatList, Alert } from 'react-native'
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import RBSheet from "react-native-raw-bottom-sheet";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
//redux
import { connect } from 'react-redux';
import { AddTransactions, AddNewTransaction } from '../redux/actions/transactionAction';
import { AddAccount } from '../redux/actions/accountAction';
import { Snackbar } from 'react-native-paper';

const CREATE_TRANSACTION_MUTATION = gql`
mutation CreateTransaction($input: createTransactionInput!) {
  createTransaction(input: $input) {
    id
    account_id
    amount
  }
}
`
const QUERY_ALL_ACCOUNTS = gql`
query Accounts {
   accounts {
    ... on AccountSuccessfulResult {
      accounts {
        name
        balance
        id
      }
    }
  }
}
`
const CREATE_ACCOUNT_SUBSCRIPTION = gql`
subscription Subscription {
  accountCreated {
    id
    name
    balance
    initial_balance
    note
    opening_date
    created_at
    updated_at
  }
}
`
function AddTransaction(props) {
    // graphs
    const { data: SubscriptionData, loading: subscriptionLoading, error: subscriptionError } = useSubscription(CREATE_ACCOUNT_SUBSCRIPTION, {
        onSubscriptionData: (data) => {
            refetch();
        }
    })
    const [createTransaction, { error }] = useMutation(CREATE_TRANSACTION_MUTATION)
    const { loading, data, refetch } = useQuery(QUERY_ALL_ACCOUNTS);

    // states
    const [account_id, setaccountId] = useState("");
    const [amount, setAmount] = useState(0);
    const [accountName, setAccountName] = useState("Choose account");
    const refRBSheet = useRef();
    const [isOffline, setOfflineStatus] = useState(false);
    const [visible, setVisible] = React.useState(false);

    // logic
    const onToggleSnackBar = () => setVisible(!visible);
    const onDismissSnackBar = () => setVisible(false);

    useEffect(() => {
        NetInfo.addEventListener((state) => {
            const offline = !(state.isConnected && state.isInternetReachable);
            setOfflineStatus(offline);
            if (!offline) {
                //fill state with accounts
                // if (data)
                    // props.AddAccount(data.accounts.accounts)
            }
        });
    }, [isOffline]);

    const renderItem = (itemData) => {
        return (
            <View style={{ paddingHorizontal: 20, marginTop: 20, width: "100%" }}>
                <TouchableOpacity onPress={async () => {
                    setAccountName(itemData.item.name);
                    setaccountId(itemData.item.id)
                    refRBSheet.current.close()
                }} style={{ flexDirection: "row", width: "100%" }}>
                    <FontAwesome style={{ paddingTop: 8, paddingRight: 10, width: "15%" }} name="bank" size={12} color="#4DDA54" />
                    <View style={{ width: "45%" }}>
                        <Text style={{ color: "black", fontSize: 15 }}>{itemData.item.name}</Text>
                    </View >
                    <View style={{
                        flex: 1, paddingRight: 10, alignItems: "flex- end", width: "43%"
                    }}>
                        <Text style={{ color: "black", fontSize: 15 }}>
                            {itemData.item.balance}
                        </Text>
                    </View >
                </TouchableOpacity >
            </View >
        );
    }

    return (
        <View style={{ flex: 1, paddingTop: 50, paddingHorizontal: 20 }}>
            <View>
                <Text style={{ textAlign: "center", fontWeight: "bold", paddingBottom: 30 }}>Add Transaction</Text>
                <View style={{ minWidth: "90%", height: 200, borderColor: "gray", borderWidth: .7, borderRadius: 10, padding: 10 }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={{ fontWeight: "bold", marginRight: 10 }}>Account Name: </Text>
                        <TouchableOpacity onPress={() => refRBSheet.current.open()}><Text>{accountName}</Text></TouchableOpacity>
                        <RBSheet
                            ref={refRBSheet}
                            closeOnDragDown={true}
                            closeOnPressMask={false}
                            customStyles={{
                                wrapper: {
                                    backgroundColor: "rgba(128, 128, 128, 0.7)"
                                },
                                draggableIcon: {
                                    backgroundColor: "#000"
                                }
                            }}
                        >
                            <SafeAreaView
                                style={{
                                    backgroundColor: "white",
                                    borderTopRightRadius: 10,
                                    borderTopLeftRadius: 10
                                }}
                            >
                                <FlatList
                                    ListFooterComponent={<View style={{ height: 10, marginBottom: 10 }}></View>}
                                    scrollEnabled={true}
                                    key={Math.random()}
                                    data={props.accountState.accounts}
                                    keyExtractor={(item, index) => {
                                        return index.toString();
                                    }}
                                    renderItem={(itemData) => renderItem(itemData)}
                                    showsVerticalScrollIndicator={false}
                                />

                            </SafeAreaView>


                        </RBSheet>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 15 }}>
                        <Text style={{ fontWeight: "bold", marginRight: 10 }}>Amount: </Text>
                        <TextInput style={{ height: 30, borderBottomWidth: .6, borderBottomColor: "gray", width: 200 }}
                            placeholder='enter Amount' value={amount.toString()} onChange={(e) => setAmount(Number(e.nativeEvent.text))} ></TextInput>
                    </View>
                    <TouchableOpacity
                        onPress={async() => {
                            let newArray = [];
                            // for (let index = 0; index < 1000000; index++) {
                            //     newArray.push({
                            //         amount: index,
                            //         id: "id" + index,
                            //         date: Date.now()
                            //     })
                            // }
                            // Snapshot date befor the inserting data
                            const dateBefor = new Date();

                            // inserting data
                            // await props.AddTransactions(newArray)

                            // Snapshot after befor the inserting data
                            const dateAfter = new Date();

                            console.log(dateBefor)

                            const diffInSecends = (dateAfter - dateBefor) / 1000
                            const diffInMin = diffInSecends / 60
                            const diffInHours = diffInMin / 60

                            console.log("In seconds", diffInSecends)
                            console.log("In Minutes", diffInMin)
                            console.log("In Hours", diffInHours)

                            console.log(dateAfter)
                        }}
                        style={{ marginTop: 20, backgroundColor: "#20B2AA", height: 40, paddingHorizontal: 20, justifyContent: "center", alignItems: "center", borderRadius: 10 }}>
                        <Text style={{ color: "white" }}>Add Transaction</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                        onPress={async() => {
                            if (isOffline) {
                                await props.AddNewTransaction(account_id,amount,"true")
                            } else {
                                console.log("first_______________________________")
                                createTransaction({
                                    variables: {
                                        input: {
                                            account_id,
                                            amount
                                        }
                                    }
                                })
                            }
                        }}
                        style={{ marginTop: 20, backgroundColor: "#20B2AA", height: 40, paddingHorizontal: 20, justifyContent: "center", alignItems: "center", borderRadius: 10 }}>
                        <Text style={{ color: "white" }}>Add Transaction</Text>
                    </TouchableOpacity> */}
                </View>
                <TouchableOpacity
                    onPress={() => {
                        props.navigation.navigate("TransactionList")
                    }}
                    style={{ marginTop: 20, backgroundColor: "#6495ED", height: 40, paddingHorizontal: 20, justifyContent: "center", alignItems: "center", borderRadius: 10 }}>
                    <Text style={{ color: "white" }}>Show Transactions</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        props.navigation.navigate("DisplayHugeList")
                    }}
                    style={{ marginTop: 20, backgroundColor: "#6495EF", height: 40, paddingHorizontal: 20, justifyContent: "center", alignItems: "center", borderRadius: 10 }}>
                    <Text style={{ color: "white" }}>Display Huge List</Text>
                </TouchableOpacity>
                <Text style={{ color: "black" }}>{props.transactionState.transactions.length}</Text>
            </View>
            {isOffline &&
                <Snackbar
                    visible={true}
                    onDismiss={onDismissSnackBar}
                    action={{
                        label: 'Undo',
                        onPress: () => {
                            // setOfflineStatus(false)
                        },
                    }}>
                    You are currenty offline.
                </Snackbar>}
        </View >)
}

const mapStatetoProps = (state) => {
    return {
        transactionState: state.transactionReducer,
        accountState: state.accountReducer,
    }
}
const mapDispatchtoProps = (dispatch) => {
    return {
        AddNewTransaction: (account_id, amount, is_offline) => dispatch(AddNewTransaction(account_id, amount, is_offline)),
        AddTransactions: (transaction) => dispatch(AddTransactions(transaction)),
        AddAccount: (account) => dispatch(AddAccount(account))

    }
}
export default connect(mapStatetoProps, mapDispatchtoProps)(AddTransaction);
