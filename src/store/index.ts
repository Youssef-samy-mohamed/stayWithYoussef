// src/store/index.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage

// Import your reducers
import hotelsReducer from "../store/hotels/hotelsSlice";
import hotelDetailsReducer from "../store/hotelDetails/hotelDetailsSlice";
import bookingReducer from "../store/booking/bookingSlice"; // ✅ New

// Persist config for hotels only (excluding hotelDetails & booking)
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["hotels" , "booking"],
};

const rootReducer = combineReducers({
  hotels: hotelsReducer,
  hotelDetails: hotelDetailsReducer,
  booking: bookingReducer, // ✅ Added here
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const persistor = persistStore(store);

export { store, persistor };
