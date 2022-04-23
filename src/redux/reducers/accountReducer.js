import {ADD_ACCOUNT} from '../types';

const initialState = {
    accounts:[
        {
            __typename: "Account",
            balance: 0,
            id: 0,
            name: ""
        }
    ]
}

const accountReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_ACCOUNT:
            return {
                ...state,
                accounts:[...action.payload]
            }
        default:
            return state;
    }
}

export default accountReducer;