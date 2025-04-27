import React from "react";
import { HotelDetails, Room, Booking } from "../../types";
import axiosErrorHandler from "../../utils/axiosErrorHandler";
import { toast } from "react-toastify";

interface RoomCardProps {
  room: Room;
  hotel: HotelDetails;
  checkInDate: Date | null;
  checkOutDate: Date | null;
  numberOfGuests: number;
  isRoomBooked: (
    room: Room,
    checkIn: Date | null,
    checkOut: Date | null
  ) => boolean;
  onBook: (
    bookingData: Omit<Booking, "id" | "createdAt" | "status">
  ) => Promise<void>;
}

const RoomCard = ({
  room,
  hotel,
  checkInDate,
  checkOutDate,
  numberOfGuests,
  isRoomBooked,
  onBook,
}: RoomCardProps) => {
  const isBooked = isRoomBooked(room, checkInDate, checkOutDate);

  const handleBook = async () => {
    try {
      const bookingData: Omit<Booking, "id" | "createdAt" | "status"> = {
        userId: "user-id-placeholder", // Replace with actual user ID
        hotelId: hotel.id,
        hotelName: hotel.name,
        hotel,
        room,
        roomType: room.type,
        bedType: room.bed_type,
        pricePerNight: room.price_per_night,
        currency: room.currency || "$",
        numberOfGuests,
        checkInDate: checkInDate
          ? checkInDate.toISOString().split("T")[0]
          : null,
        checkOutDate: checkOutDate
          ? checkOutDate.toISOString().split("T")[0]
          : null,
        numberOfNights:
          checkInDate && checkOutDate
            ? Math.max(
                1,
                Math.ceil(
                  (checkOutDate.getTime() - checkInDate.getTime()) /
                    (1000 * 3600 * 24)
                )
              )
            : 1,
        totalPrice:
          checkInDate && checkOutDate
            ? Math.round(
                Math.max(
                  1,
                  Math.ceil(
                    (checkOutDate.getTime() - checkInDate.getTime()) /
                      (1000 * 3600 * 24)
                  )
                ) *
                  room.price_per_night *
                  100
              ) / 100
            : room.price_per_night,
        checkIn: "14:00", // Default or from config
        checkOut: "12:00", // Default or from config
      };

      await onBook(bookingData);
      toast.success("Booking created successfully!");
    } catch (error: unknown) {
      const errorMessage = axiosErrorHandler(error);
      console.error("Booking error:", { room: room.type, errorMessage });
      toast.error(`Failed to book the room: ${errorMessage}`);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-xl p-6 mb-6 border border-[#eee] hover:shadow-2xl transition-shadow">
      <h3 className="text-xl font-semibold text-[#B89D63] mb-2">{room.type}</h3>
      <p className="text-sm text-gray-600 mb-1">
        <strong>Bed Type:</strong> {room.bed_type}
      </p>
      <p className="text-sm text-gray-600 mb-1">
        <strong>Max Guests:</strong> {room.max_guests}
      </p>
      <p className="text-sm text-gray-600 mb-1">
        <strong>Price per Night:</strong> {room.currency || "$"}{" "}
        {room.price_per_night.toFixed(2)}
      </p>
      <p className="text-sm text-gray-600 mb-4">
        <strong>Status:</strong> {isBooked ? "Booked" : "Available"}
      </p>
      <button
        onClick={handleBook}
        disabled={
          isBooked ||
          !checkInDate ||
          !checkOutDate ||
          numberOfGuests > room.max_guests
        }
        className={`px-5 py-2 font-semibold rounded-xl shadow transition ${
          isBooked ||
          !checkInDate ||
          !checkOutDate ||
          numberOfGuests > room.max_guests
            ? "bg-gray-400 text-gray-700 cursor-not-allowed"
            : "bg-[#B89D63] text-white hover:bg-[#a58950]"
        }`}
      >
        Book Now
      </button>
    </div>
  );
};

export default React.memo(RoomCard);
