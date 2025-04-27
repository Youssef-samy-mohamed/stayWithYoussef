import { Booking } from "../../types";
import calculateBookingDetails from "../../utils/calculateBookingDetails";

interface BookingCardProps {
  booking: Booking;
  onCancel: (bookingId: number) => Promise<void>;
}

export const BookingCard = ({ booking, onCancel }: BookingCardProps) => {
  const { numberOfNights, totalPrice } = calculateBookingDetails(
    booking.checkInDate,
    booking.checkOutDate,
    booking.pricePerNight
  );

  return (
    <div className="bg-white shadow-xl rounded-xl p-6 border border-[#eee] hover:shadow-2xl transition-shadow">
      <h2 className="text-2xl font-semibold text-[#B89D63] mb-2">
        Booking Details for {booking.room.type}
      </h2>
      <div className="space-y-1">
        <p className="text-sm text-gray-600">
          <strong>Hotel Name:</strong> {booking.hotel.name}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Room Type:</strong> {booking.room.type} (
          {booking.room.bed_type})
        </p>
        <p className="text-sm text-gray-600">
          <strong>Guests:</strong> {booking.numberOfGuests}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Check-in Date:</strong>{" "}
          {booking.checkInDate || "Not specified"}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Check-in Time:</strong> {booking.checkIn}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Check-out Date:</strong>{" "}
          {booking.checkOutDate || "Not specified"}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Check-out Time:</strong> {booking.checkOut}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Number of Nights:</strong> {numberOfNights}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Price Per Night:</strong> {booking.currency}{" "}
          {booking.pricePerNight.toFixed(2)}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Total Price:</strong> {booking.currency}{" "}
          {totalPrice.toFixed(2)}
        </p>
        <p className="text-sm text-green-600">
          <strong>Status:</strong> {booking.status || "Confirmed"}
        </p>
      </div>
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => booking.id && onCancel(booking.id)}
          className="px-5 py-2 bg-[#B89D63] text-white font-semibold rounded-xl shadow hover:bg-[#a58950] transition"
          disabled={!booking.id}
        >
          Cancel Booking
        </button>
      </div>
    </div>
  );
};
