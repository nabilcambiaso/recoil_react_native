import { ADD_TRANSACTION, ADD_TRANSACTIONS,CLEAR_TRANSACTIONS } from '../types';


export const AddNewTransaction = (account_id, amount, is_offline) => async (dispatch) => {
    try {

        dispatch({
            type: ADD_TRANSACTION,
            payload: [{
                account_id,
                amount,
                is_offline,
                id: parseInt(Date.now())

            }],
        });
    } catch (err) { }
}

export const AddTransactions = (transaction) => async (dispatch) => {
    try {
        dispatch({
            type: ADD_TRANSACTIONS,
            payload: transaction,
        });
    } catch (err) { }
}

export const ClearTransactions = () => async (dispatch) => {
    try {
        dispatch({
            type: CLEAR_TRANSACTIONS,
            payload: [],
        });
    } catch (err) { }
}
