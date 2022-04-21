import React, { useState, useRef } from 'react'
import { View, Text, TouchableOpacity, TextInput, FlatList } from 'react-native'
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import RBSheet from "react-native-raw-bottom-sheet";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from '@expo/vector-icons';
//redux
import { connect } from 'react-redux';
import { AddTransactions } from '../redux/actions/transactionAction';
//recoil
// import { useRecoilValue } from 'recoil';
// import { transactionsListSize } from '../atoms/transactionState';
// import { useTransaction } from '../hooks/useTransaction';

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
    const { data: SubscriptionData,
        loading: subscriptionLoading,
        error: subscriptionError
    } = useSubscription(CREATE_ACCOUNT_SUBSCRIPTION, {
        onSubscriptionData: (data) => {
            refetch();
        }
    })
    if (SubscriptionData) {
        // console.log("SubscriptionData")
    }
    if (subscriptionError) {
        console.log(subscriptionError)
    }

    //recoil
    // const transactionHook = useTransaction();
    // const listSize = useRecoilValue(transactionsListSize);

    const [createTransaction, { error }] = useMutation(CREATE_TRANSACTION_MUTATION)
    const [account_id, setaccountId] = useState("");
    const [amount, setAmount] = useState(0);
    const [accountName, setAccountName] = useState("Choose account");
    const refRBSheet = useRef();
    const { loading, data, refetch } = useQuery(QUERY_ALL_ACCOUNTS);



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
    return (<View style={{ flex: 1, paddingTop: 50, paddingHorizontal: 20 }}>
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
                            data={data != undefined && data.accounts.accounts}
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
                onPress={() => {
                    createTransaction({
                        variables: {
                            input: {
                                account_id,
                                amount
                            }
                        }
                    })
                }}
                style={{ marginTop: 20, backgroundColor: "#20B2AA", height: 40, paddingHorizontal: 20, justifyContent: "center", alignItems: "center", borderRadius: 10 }}>
                <Text style={{ color: "white" }}>Add Transaction</Text>
            </TouchableOpacity>
        </View>
        <TouchableOpacity
            onPress={() => {
                props.navigation.navigate("TransactionList")
            }}
            style={{ marginTop: 20, backgroundColor: "#6495ED", height: 40, paddingHorizontal: 20, justifyContent: "center", alignItems: "center", borderRadius: 10 }}>
            <Text style={{ color: "white" }}>Show Transactions</Text>
        </TouchableOpacity>
    </View >)
}

const mapStatetoProps = (state) => {
    return {
        transactionState: state.transactionReducer,
    }
}
const mapDispatchtoProps = (dispatch) => {
    return {
        AddTransactions: (txt) => dispatch(AddTransactions(txt)),
    }
}
export default connect(mapStatetoProps, mapDispatchtoProps)(AddTransaction);
