import React from 'react'
import { View, Text,TouchableOpacity } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { useTransaction } from '../hooks/useTransaction'

function TransactionList() {
    const transactionHook=useTransaction();
    return (
        <View>
            <View style={{ padding: 10 }}>
                {transactionHook.transactionsList.map((transaction, index) => (
                    <View style={{ marginTop: 10, backgroundColor: "#E6E6FA",width:"90%",alignSelf:"center",paddingHorizontal:25,paddingVertical:5 }} key={index}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={{ fontWeight: "bold", marginRight: 10 }}>ID: </Text>
                            <Text>{transaction.id}</Text>
                        </View>
                        <TouchableOpacity
                          onPress={()=>transactionHook.deleteTransaction(transaction.id)}
                         style={{marginLeft:"auto",justifyContent:"center",paddingTop:10}}>
                        <FontAwesome name="trash" size={24} color="#8B0000" />
                        </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={{ fontWeight: "bold", marginRight: 10 }}>Balance: </Text>
                            <Text>{transaction.balance}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>

    )
}

export default TransactionList