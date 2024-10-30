import { combineReducers, createStore } from "redux";

interface actionType {
    type: string,
    payload: any
}

export interface stateType {
    isSmall: boolean,
    isSideBar: boolean
}

// reducer function for sideBarVisibility
const isSideBar = (prevState: boolean = false, action: actionType) => {
    if (action.type === 'sidebar') {
        return action.payload;
    }
    return prevState;
}

// reducer function for resize
const isSmall = (prevState: boolean = false, action: actionType) => {
    if (action.type === 'resize') {
        return action.payload;
    }
    return prevState;
}

const appReducer = combineReducers({
    isSideBar,
    isSmall
})

const store = createStore(appReducer);

// actions----------------------------------------------

// action for sideBar visibility
function sideBarAction(payload: boolean) {
    return {
        type: 'sidebar',
        payload: payload
    }
}

// action for resize
function resizeAction(payload: boolean) {
    return {
        type: 'resize',
        payload: payload
    }
}

export {
    store,
    resizeAction,
    sideBarAction
}
