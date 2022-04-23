import {ADD_ACCOUNT} from '../types';


export const AddAccount = (account) => async (dispatch) => {
    try {
        dispatch({
            type: ADD_ACCOUNT,
            payload: account,
        }); 
    } catch (err) { }
}

