// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authSlice from './authSlice';
import postSlice from './postSlice';
import { combineReducers } from 'redux';
import socketioSlice from './socketSlice';
import chatSlice from './chatSlice';
import rtnSlice from './rtnSlice';
// src/redux/store.js
const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['socketio', 'chat'], // do not persist non-serializable data
};


const rootReducer = combineReducers({
  auth: authSlice,
  post:postSlice,
  socketio: socketioSlice,
  chat:chatSlice,
  realTimeNotification:rtnSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      ignoredPaths: ['socketio.socket', 'chat.onlineUsers'], 
    }),
});

export default store;
