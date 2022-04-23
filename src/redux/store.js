import {createStore,combineReducers, applyMiddleware} from 'redux';
import {persistStore,persistReducer} from 'redux-persist';
import transactionReducer from '../redux/reducers/transactionReducer';
import accountReducer from '../redux/reducers/accountReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import thunk from "redux-thunk";


const persistConfig={
    key:'root',
    storage:AsyncStorage
}

const appReducer = combineReducers({
    transactionReducer,
    accountReducer
  })
  
  const rootReducer = (state, action) => {
    if (action.type === 'USER_LOGOUT') {
      state = undefined;
      persistConfig.storage.removeItem('persist:root');
    }
    return appReducer(state, action)
  }


const persistedReducer = persistReducer(persistConfig,rootReducer);

export default () =>{
    let store=createStore(persistedReducer,applyMiddleware(thunk));
    let persistor = persistStore(store);
    return {store,persistor,persistConfig}
}