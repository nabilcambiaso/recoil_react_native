import React, { useState } from 'react'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import { useRecoilValue } from 'recoil';
import { transactionsListSize } from '../atoms/transactionState';
import { useTransaction } from '../hooks/useTransaction';
import { gql,  useMutation } from '@apollo/client';

const CREATE_TRANSACTION_MUTATION = gql`
mutation CreateTransaction($input: createTransactionInput!) {
  createTransaction(input: $input) {
    id
    account_id
    amount
  }
}
`

function AddTransaction({ props }) {

    const [createTransaction, { error }] = useMutation(CREATE_TRANSACTION_MUTATION)
    const [account_id, setaccountId] = useState("");
    const [amount, setAmount] = useState(0);
    const transactionHook = useTransaction();
    const listSize = useRecoilValue(transactionsListSize);

    return (<View style={{ flex: 1, paddingTop: 50, }}>
        <Text style={{ textAlign: "center", fontWeight: "bold", paddingBottom: 30 }}>Add Transaction</Text>
        <View style={{ minWidth: "90%", height: 200, borderColor: "gray", borderWidth: .7, borderRadius: 10, padding: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontWeight: "bold", marginRight: 10 }}>Account ID: </Text>
                <TextInput style={{ height: 30, borderBottomWidth: .6, borderBottomColor: "gray", width: 200 }}
                    placeholder='enter Account ID' value={account_id} onChange={(e) => setaccountId(Number(e.nativeEvent.text))} ></TextInput>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 15 }}>
                <Text style={{ fontWeight: "bold", marginRight: 10 }}>Amount: </Text>
                <TextInput style={{ height: 30, borderBottomWidth: .6, borderBottomColor: "gray", width: 200 }}
                    placeholder='enter Amount' value={amount} onChange={(e) => setAmount(Number(e.nativeEvent.text))} ></TextInput>
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
            <Text style={{ color: "white" }}>Show Transactions ({listSize})</Text>
        </TouchableOpacity>

    </View>)
}

export default AddTransaction