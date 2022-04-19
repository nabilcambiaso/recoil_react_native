import React, { useState } from 'react'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import { useRecoilValue } from 'recoil';
import { transactionsListSize } from '../atoms/transactionState';
import { useTransaction } from '../hooks/useTransaction';

function AddTransaction ({props}) {

    const [id, setId] = useState("");
    const [balance, setBalance] = useState("");
    const transactionHook = useTransaction();
    const listSize=useRecoilValue(transactionsListSize);

    return (<View style={{ flex: 1, paddingTop: 50, }}>
        <Text style={{ textAlign: "center", fontWeight: "bold", paddingBottom: 30 }}>Add Transaction</Text>
        <View style={{ minWidth: "90%", height: 200, borderColor: "gray", borderWidth: .7, borderRadius: 10, padding: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontWeight: "bold", marginRight: 10 }}>ID: </Text>
                <TextInput style={{ height: 30, borderBottomWidth: .6, borderBottomColor: "gray", width: 200 }}
                    placeholder='enter ID' value={id} onChange={(e) => setId(e.nativeEvent.text)} ></TextInput>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 15 }}>
                <Text style={{ fontWeight: "bold", marginRight: 10 }}>Balance: </Text>
                <TextInput style={{ height: 30, borderBottomWidth: .6, borderBottomColor: "gray", width: 200 }}
                    placeholder='enter Balance' value={balance} onChange={(e) => setBalance(e.nativeEvent.text)} ></TextInput>
            </View>
            <TouchableOpacity
                onPress={() => {
                    transactionHook.addTransaction(id, balance)
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