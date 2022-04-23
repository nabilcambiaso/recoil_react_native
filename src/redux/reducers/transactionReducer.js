import { ADD_TRANSACTION, ADD_TRANSACTIONS, CLEAR_TRANSACTIONS } from '../types';

const initialState = {
    transactions: [
        {
            __typename: "Transaction",
            account_id: 0,
            amount: 0,
            created_at: "2022-01-01T23:08:24.224Z",
            id: 0,
            updated_at: "2022-01-01T23:08:24.224Z",
        }
    ],
}

const transactionReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TRANSACTION:
            console.log("cc", action.payload)
            return {
                ...state,
                transactions: [...state.transactions, ...action.payload]
            }
        case ADD_TRANSACTIONS:
            var offline_transactions = state.transactions.filter(function (tr) {
                return tr.is_offline == "true"
            });
            return {
                ...state,
                transactions: [...offline_transactions, ...action.payload]
            }
        case CLEAR_TRANSACTIONS:
            return {
                ...state,
                transactions: []
            }
            
        default:
            return state;
    }
}

export default transactionReducer;