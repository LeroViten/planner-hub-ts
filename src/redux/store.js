import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from './auth/authSlice';
import { authApi } from './auth/authApi';
import { contactApi } from './contacts/contactSlice';
import { noteApi } from './notes/noteSlice';
import { weatherApi } from './weather/weatherSlice';
import axiosBaseQuery from '../services/axiosBaseQuery';

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['token'],
};

const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authReducer),
    [authApi.reducerPath]: authApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
    [noteApi.reducerPath]: noteApi.reducer,
    [weatherApi.reducerPath]: weatherApi.reducer,
  },
  middleware: getDefaultMiddleware => [
    ...getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
    authApi.middleware,
    contactApi.middleware,
    noteApi.middleware,
    weatherApi.middleware,
  ],
  devTools: process.env.NODE_ENV !== 'production',
});

store.subscribe(axiosBaseQuery);
const persistor = persistStore(store);
export { store, persistor };

setupListeners(store.dispatch);
