import React,{createContext,useContext,useReducer} from 'react';

export const StateContext=createContext();
export const StateProvider=({reducer,initialState,children})=>(
    <StateContext.Provider value={useReducer(reducer,initialState)}>
        {children}
    </StateContext.Provider>
    );
    //use parenthesis for object and components
export const useStateValue = ()=>useContext(StateContext);