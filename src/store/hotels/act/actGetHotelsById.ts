import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

const  actGetHotels = createAsyncThunk(
  "hotels/getHotels",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        
      const response = await axios.get("http://localhost:5000/hotels");
      return response.data;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actGetHotels;