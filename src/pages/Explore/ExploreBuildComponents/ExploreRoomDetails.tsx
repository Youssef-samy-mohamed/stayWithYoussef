import React, { useMemo } from "react";
import { useAppSelector } from "../../../store/hooks";
import { HotelDetails, Room } from "../../../types";
import { useBooking } from "../../../hooks/useBooking";
import DatePicker from "react-datepicker";
import RoomCard from "../../../components/ExplorePageDetails/RoomCard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ExploreRoomDetailsProps {
  rooms: Room[];
  hotel: HotelDetails;
}

const ExploreRoomDetails = ({ rooms, hotel }: ExploreRoomDetailsProps) => {
  const bookings = useAppSelector((state) => state.booking.bookings);
  const [checkInDate, setCheckInDate] = React.useState<Date | null>(new Date());
  const [checkOutDate, setCheckOutDate] = React.useState<Date | null>(
    new Date(Date.now() + 24 * 60 * 60 * 1000)
  );
  const [numberOfGuests, setNumberOfGuests] = React.useState<number>(1);

  const { isRoomBooked, bookRoom } = useBooking(hotel, bookings);

  const minCheckOutDate = useMemo(
    () =>
      checkInDate
        ? new Date(checkInDate.getTime() + 24 * 60 * 60 * 1000)
        : new Date(),
    [checkInDate]
  );

  const maxGuests = useMemo(
    () => Math.max(...rooms.map((room) => room.max_guests), 1),
    [rooms]
  );

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-4 text-[#B89D63]">
        Available Rooms
      </h2>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Check-in Date
        </label>
        <DatePicker
          selected={checkInDate}
          onChange={(date: Date | null) => setCheckInDate(date)}
          minDate={new Date()}
          className="p-2 border rounded-lg w-full max-w-xs"
          dateFormat="yyyy-MM-dd"
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Check-out Date
        </label>
        <DatePicker
          selected={checkOutDate}
          onChange={(date: Date | null) => setCheckOutDate(date)}
          minDate={minCheckOutDate}
          className="p-2 border rounded-lg w-full max-w-xs"
          dateFormat="yyyy-MM-dd"
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Guests
        </label>
        <input
          type="number"
          value={numberOfGuests}
          onChange={(e) =>
            setNumberOfGuests(Math.max(1, parseInt(e.target.value)))
          }
          min={1}
          max={maxGuests}
          className="p-2 border rounded-lg w-full max-w-xs"
        />
      </div>
      {rooms?.length > 0 ? (
        rooms.map((room, idx) => (
          <RoomCard
            key={`${room.type}-${idx}`}
            room={room}
            hotel={hotel}
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            numberOfGuests={numberOfGuests}
            isRoomBooked={isRoomBooked}
            onBook={bookRoom}
          />
        ))
      ) : (
        <p className="text-sm text-gray-600">No rooms available.</p>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default React.memo(ExploreRoomDetails);
