import { useAppDispatch } from "../store/hooks";
import { addBooking } from "../store/booking/bookingSlice";
import { HotelDetails, Room, Booking } from "../types";
import axiosErrorHandler from "../utils/axiosErrorHandler";
import { toast } from "react-toastify";

export const useBooking = (hotel: HotelDetails, bookings: Booking[]) => {
  const dispatch = useAppDispatch();

  const isRoomBooked = (
    room: Room,
    checkIn: Date | null,
    checkOut: Date | null
  ) => {
    if (!checkIn || !checkOut) return false;
    return bookings.some((booking) => {
      if (booking.hotelId !== hotel.id || booking.room.type !== room.type)
        return false;
      const bookedCheckIn = booking.checkInDate
        ? new Date(booking.checkInDate)
        : null;
      const bookedCheckOut = booking.checkOutDate
        ? new Date(booking.checkOutDate)
        : null;
      if (!bookedCheckIn || !bookedCheckOut) return false;
      return checkIn < bookedCheckOut && checkOut > bookedCheckIn;
    });
  };

  const bookRoom = async (
    bookingData: Omit<Booking, "id" | "createdAt" | "status">
  ) => {
    try {
      console.log("Attempting to create booking:", {
        hotelId: bookingData.hotelId,
        roomType: bookingData.roomType,
        checkInDate: bookingData.checkInDate,
      });
      const response = await fetch("http://localhost:5000/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      console.log(`POST /booking response:`, {
        status: response.status,
        ok: response.ok,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message ||
          `Failed to create booking (status: ${response.status})`;
        console.error("Booking creation error:", errorMessage);
        throw new Error(errorMessage);
      }

      const newBooking: Booking = await response.json();
      if (!newBooking.id) {
        console.error("Server returned booking without ID:", newBooking);
        throw new Error("Server returned booking without ID");
      }

      console.log("Created booking:", {
        id: newBooking.id,
        roomType: newBooking.room.type,
      });
      dispatch(addBooking(newBooking));
      toast.success(`Booking ID ${newBooking.id} created successfully!`);
    } catch (error: unknown) {
      const errorMessage = axiosErrorHandler(error);
      console.error("Booking error:", errorMessage);
      toast.error(`Failed to book the room: ${errorMessage}`);
      throw new Error(errorMessage);
    }
  };

  return { isRoomBooked, bookRoom };
};
