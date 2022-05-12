import React, { createContext, useState} from 'react';
import { dispatch, initialState } from './Reducer.js';
const Theme = createContext();

function Provider(props) {
    const [store, setStore] = useState(initialState);

    function dispatchAction(type,data) {
        dispatch({ setStore: setStore, store: store, type: type, payload:data });
    }
    
    return (
        <Theme.Provider value={{
            store:store,
            dispatchAction: dispatchAction
        }}>
            {props.children}
        </Theme.Provider>
    )
}

export { Theme, Provider };