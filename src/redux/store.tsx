import { combineReducers, createStore } from "redux";

interface actionType {
    type: string;
    payload: any;
}

export interface stateType {
    isSideBarVisible: boolean;
    isSmall: boolean;
    theme: boolean;
}

// reducer function for student sideBarVisibility
const isSideBarVisible = (prevState: boolean = false, action: actionType) => {
    if (action.type === "sideBarVisibility") {
        return action.payload;
    }
    return prevState;
};

// reducer function for resize
const isSmall = (
    prevState: boolean = localStorage.getItem("isSizeSmall") === "1"
        ? true
        : false,
    action: actionType
) => {
    if (action.type === "resize") {
        return action.payload;
    }
    return prevState;
};

// theme changing
const theme = (prevState: boolean = true, action: actionType) => {
    if (action.type === "theme") {
        return action.payload;
    }
    return prevState;
};

const appReducer = combineReducers({
    isSideBarVisible,
    isSmall,
    theme,
});

const store = createStore(appReducer);

// actions=======================================================

// action for sideBar visibility
function sideBarVisibilityAction(payload: boolean) {
    return {
        type: "sideBarVisibility",
        payload: payload,
    };
}

// action for resize
function resizeAction(payload: boolean) {
    return {
        type: "resize",
        payload: payload,
    };
}

// action for theme changing
function themeAction(payload: boolean) {
    return {
        type: "theme",
        payload: payload,
    };
}

export {
    store,
    sideBarVisibilityAction,
    resizeAction,
    themeAction,
};
