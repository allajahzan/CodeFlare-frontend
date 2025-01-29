import { combineReducers, createStore } from "redux";

interface actionType {
    type: string;
    payload: any;
}

export interface stateType {
    isSideBarVisible: boolean;
    isSmall: boolean;
    role: string;
}

// reducer function for sideBar visibility
const isSideBarVisible = (prevState: boolean = false, action: actionType) => {
    if (action.type === "sideBarVisibility") {
        return action.payload;
    }
    return prevState;
};

// Reducer function for resize
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

// Reducer function for role changing
const publicRoutes = ["login", "forgot-password", "reset-password"] as string[];
const initialRole = publicRoutes.includes(location.pathname.split("/")[2])
    ? ""
    : location.pathname.split("/")[1];
const role = (prevState: string = initialRole, action: actionType) => {
    if (action.type === "role") {
        return action.payload;
    }
    return prevState;
};

const appReducer = combineReducers({
    isSideBarVisible,
    isSmall,
    role,
});

const store = createStore(appReducer);

// Actions=======================================================

// Action for sideBar visibility
function sideBarVisibilityAction(payload: boolean) {
    return {
        type: "sideBarVisibility",
        payload: payload,
    };
}

// Action for resize
function resizeAction(payload: boolean) {
    return {
        type: "resize",
        payload: payload,
    };
}

// Action for theme changing
function roleAction(payload: string) {
    return {
        type: "role",
        payload: payload,
    };
}

export {
    store,
    sideBarVisibilityAction,
    resizeAction,
    roleAction,
};
