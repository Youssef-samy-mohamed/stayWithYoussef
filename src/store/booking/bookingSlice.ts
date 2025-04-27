import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Booking } from "../../types";
import { toast } from "react-toastify";

interface BookingState {
  bookings: Booking[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  status: "idle",
  error: null,
};

// Fetch all bookings to sync Redux store with backend
export const fetchBookings = createAsyncThunk(
  "booking/fetchBookings",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching bookings from server");
      const response = await fetch("http://localhost:5000/booking");
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to fetch bookings (status: ${response.status})`
        );
      }
      const bookings: Booking[] = await response.json();
      console.log(
        "Fetched bookings:",
        bookings.map((b) => ({ id: b.id, roomType: b.room.type }))
      );
      return bookings;
    } catch (error: any) {
      console.error("Fetch bookings error:", error.message);
      toast.error(`Failed to fetch bookings: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);

// Delete a booking from Redux store only (no backend request)
export const deleteBooking = createAsyncThunk(
  "booking/deleteBooking",
  async (bookingId: number, { rejectWithValue }) => {
    try {
      console.log(`Removing booking ID ${bookingId} from Redux store`);
      // Simulate successful deletion without contacting backend
      return bookingId;
    } catch (error: any) {
      console.error("Delete booking error:", {
        bookingId,
        message: error.message,
      });
      toast.error(`Failed to remove booking ID ${bookingId}: ${error.message}`);
      return rejectWithValue({ bookingId, message: error.message });
    }
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    addBooking: (state, action: PayloadAction<Booking>) => {
      if (!action.payload.id) {
        console.error("Cannot add booking without ID:", action.payload);
        return;
      }
      const existingBooking = state.bookings.find(
        (booking) => booking.id === action.payload.id
      );
      if (existingBooking) {
        console.warn("Duplicate booking ID detected:", action.payload.id);
        return;
      }
      state.bookings.push(action.payload);
      console.log(
        "Added booking ID:",
        action.payload.id,
        "Total bookings:",
        state.bookings.length
      );
    },
    removeBooking: (state, action: PayloadAction<number>) => {
      const initialLength = state.bookings.length;
      state.bookings = state.bookings.filter((booking) => {
        if (!booking.id) {
          console.warn("Found booking without ID during removal:", booking);
          return true;
        }
        return booking.id !== action.payload;
      });
      console.log(
        `Removed booking ID: ${action.payload}, ` +
          `Bookings before: ${initialLength}, ` +
          `Bookings after: ${state.bookings.length}, ` +
          `Remaining bookings:`,
        state.bookings.map((b) => b.id)
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch bookings
      .addCase(fetchBookings.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bookings = action.payload;
        state.error = null;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Delete booking
      .addCase(deleteBooking.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.status = "succeeded";
        const bookingId = action.payload;
        state.bookings = state.bookings.filter(
          (booking) => booking.id !== bookingId
        );
        state.error = null;
        console.log(
          `deleteBooking fulfilled: Removed booking ID ${bookingId}, ` +
            `Remaining bookings:`,
          state.bookings.map((b) => b.id)
        );
        toast.success(`Booking ID ${bookingId} removed successfully!`);
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.status = "failed";
        const payload = action.payload as {
          bookingId: number;
          message: string;
        };
        state.error = payload.message;
        // Still remove the booking locally even on error
        state.bookings = state.bookings.filter(
          (booking) => booking.id !== payload.bookingId
        );
        console.log(
          `deleteBooking rejected: Removed booking ID ${payload.bookingId}, ` +
            `Remaining bookings:`,
          state.bookings.map((b) => b.id)
        );
      });
  },
});

export const { addBooking, removeBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
