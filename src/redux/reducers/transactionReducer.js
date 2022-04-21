import {ADD_TRANSACTION} from '../types';

const initialState = {
    transactions:[]
}

const transactionReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TRANSACTION:
            return {
                ...state,
                transactions:[...action.payload]
            }
        default:
            return state;
    }
}

export default transactionReducer;