// src/redux/slices/hotelSlice.js
import { createSlice } from "@reduxjs/toolkit";
import actGetHotels from "./act/actGetHotelsById";
import { TLoading, Hotel } from "../../types/index";



interface HotelsState {
  hotels: Hotel[];
  loading: TLoading;
  error: string | null;
}
const initialState: HotelsState = {
  hotels: [],
  loading: "idle",
  error: null,
};


const hotelSlice = createSlice({
  name: "hotels",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(actGetHotels.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(actGetHotels.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.hotels = action.payload;
      })
      .addCase(actGetHotels.rejected, (state, action) => {
        state.loading = "rejected";
        if( action.payload && typeof action.payload === "string")
        state.error = action.payload;
      });
  },
});

export { actGetHotels };
export default hotelSlice.reducer;
