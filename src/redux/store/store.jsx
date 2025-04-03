import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Uses localStorage
import authReducer from '../slices/authSlice';
import usersReducer from '../slices/usersSlice'
// Create a root reducer that combines all your reducers
const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer
  // Add other reducers here as needed
});

// Apply persist config to the root reducer
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Explicitly persist the 'auth' slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer, // Use the persisted root reducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
        // You may need to ignore some paths if you have non-serializable values
        // ignoredPaths: ['auth.someNonSerializableValue'],
      },
    }),
});

export const persistor = persistStore(store);