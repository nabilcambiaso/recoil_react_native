import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, FlatList, Image, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux';
import { AddTransactions, ClearTransactions } from '../redux/actions/transactionAction';


function DisplayHugeList(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const getData = async () => {
        const apiUrl = 'https://jsonplaceholder.typicode.com/photos?_limit=10&_page='+currentPage;
        fetch(apiUrl).then((res) => res.json()).then((resJson) => {
            setData(data.concat(resJson))
            setIsLoading(false)
        })
    }

    const renderItem = ({ item }) => {
        return (
            <View style={{ borderBottomColor: "gray", marginBottom: 10, borderBottomWidth: 1 }}>
                <Image source={{ uri: item.url }} style={{ width: "100%", height: 200, resizeMode: 'cover' }} />
                <Text style={{ fontSize: 16, padding: 5 }}>{item.title}</Text>
                <Text style={{ fontSize: 16, padding: 5 }} >{item.id}</Text>
            </View>
        )
    }

    const renderFooter = ({ item }) => {
        return (
            isLoading?
            <View style={{ marginTop: 10, alignItems: "center" }}>
                <ActivityIndicator size={'large'} />
            </View>:null
        )
    }

    useEffect(() => {
        setIsLoading(true);
        getData();
    }, [currentPage]);
 
    const handleLoadMore = () =>{
    setCurrentPage(currentPage+1);
    setIsLoading(true);
    }

    return (
        <View>
            <FlatList
                style={{ marginTop: 20, backgroundColor: "gray" }}
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={renderFooter}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0}
            >

            </FlatList>
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
        AddTransactions: (transactions) => dispatch(AddTransactions(transactions))
    }
}
export default connect(mapStatetoProps, mapDispatchtoProps)(DisplayHugeList);
