import {ADD_TRANSACTION} from '../types';


export const AddTransactions = (transaction) => async (dispatch) => {
    try {
        dispatch({
            type: ADD_TRANSACTION,
            payload: transaction,
        }); 
    } catch (err) { }
}

