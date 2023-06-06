import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from '../reducers/userSlice';
import emailReducer from '../reducers/emailSlice';
import equipmentReducer from '../reducers/equipmentSlice';
import driverReducer from '../reducers/driverSlice';
import loadingReducer from '../reducers/loadingSlice';
import equipmentDashboardReducer from '../reducers/equipmentDashboard'; // Please check for the right import

// Define a configuration for each reducer to be persisted
const userPersistConfig = {
  key: 'user',
  storage,
};

const emailPersistConfig = {
  key: 'email',
  storage,
};

const equipmentPersistConfig = {
  key: 'equipment',
  storage,
};

const driverPersistConfig = {
  key: 'driver',
  storage,
};

const loadingPersistConfig = {
  key: 'loading',
  storage,
};

const equipmentDashboardPersistConfig = {
  key: 'equipmentDashboard',
  storage,
};

// Configure the store
export const store = configureStore({
  reducer: {
    // Each reducer is wrapped with persistReducer and its own config
    user: persistReducer(userPersistConfig, userReducer),
    email: persistReducer(emailPersistConfig, emailReducer),
    equipment: persistReducer(equipmentPersistConfig, equipmentReducer),
    driver: persistReducer(driverPersistConfig, driverReducer),
    loading: persistReducer(loadingPersistConfig, loadingReducer),
    equipmentDashboard: persistReducer(equipmentDashboardPersistConfig, equipmentDashboardReducer),
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/PURGE'],
      },
    }),
});

// Define the persistor
export const persistor = persistStore(store);
