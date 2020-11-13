import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import { persistStore, persistReducer } from "redux-persist";

// stores for data
import AsyncStorage from "@react-native-community/async-storage";
import { mainReducer } from "./reducers/index.reducer.js";

const mainPersistConfig = {
  key: "main",
  storage: AsyncStorage,
  // Whitelist (Save Specific Reducers)
  whitelist: ["authReducer"],
  // Blacklist (Don"t Save Specific Reducers)
  blacklist: ["uiReducer"]
};

// const securePersistConfig = {
//   key: "secure",
//   storage: createSecureStore(),
//   whitelist: ["authReducer"]
// };

const rootReducer = combineReducers({
  main: persistReducer(mainPersistConfig, mainReducer)
  // secure: persistReducer(securePersistConfig, secureReducer)
});

// Redux: Store
const store = createStore(rootReducer, applyMiddleware(thunk));

// Middleware: Redux Persist Persister
const persistor = persistStore(store);

export { store, persistor };
