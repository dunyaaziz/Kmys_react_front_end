import { createStore, applyMiddleware, compose } from "redux";
import authReducer from './authReducer';
import SecureLs from 'secure-ls';
import thunk from "redux-thunk";
import { setAuthorizationHeader } from "../api/apiCalls";

const secureLs = new SecureLs();

const getStateFromStorage = () => {
    const hoaxAuth = secureLs.get('hoax-auth');
    let stateInLocalStorege = {
        isLoggedIn: false,
        username: undefined,
        displayName: undefined,
        image: undefined,
        password: undefined
      };
    if(hoaxAuth){
       return hoaxAuth;     
    }
    return stateInLocalStorege;
}

const updateStateInStorage = newState => {
    secureLs.set('hoax-auth', newState);
}

const configureStore = () =>{
    const initialState = getStateFromStorage();
    setAuthorizationHeader(initialState);
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store =  createStore(authReducer, initialState, composeEnhancers(applyMiddleware(thunk))) 

    store.subscribe(() => {
        updateStateInStorage(store.getState());
        setAuthorizationHeader(store.getState());
    })

    return store;
}

export default configureStore;