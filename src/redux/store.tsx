import { combineReducers, createStore } from "redux";

interface actionType {
    type: string;
    payload: any;
}

export interface stateType {
    isSideBarVisible: boolean;
    isSmall: boolean;
    theme: string;
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

// Reducer function for theme changing
type Theme = "light" | "dark";
const storedTheme = localStorage.getItem("theme") as Theme | null;
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const initialTheme = storedTheme || (prefersDark ? "dark" : "light");
const theme = (prevState: string = initialTheme, action: actionType) => {
    if (action.type === "theme") {
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
    theme,
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
function themeAction(payload: string) {
    return {
        type: "theme",
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
    themeAction,
    roleAction,
};
