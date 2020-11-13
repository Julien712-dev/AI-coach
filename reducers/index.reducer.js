// Imports: Dependencies
import { combineReducers } from "redux";

// Imports: Reducers
import authReducer from "./auth.reducer.js";
import uiReducer from "./ui.reducer.js";
// import socketReducer from "./socket.reducer.js";

// Redux: Root Reducer
const mainReducer = combineReducers({
  uiReducer: uiReducer,
  authReducer: authReducer
});

// Exports
export { mainReducer };
