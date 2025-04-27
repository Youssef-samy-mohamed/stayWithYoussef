import { useEffect, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { RootState } from "../../store";
import { BookingCard } from "../../components/ExplorePageDetails/BookingCard";
import { deleteBooking, fetchBookings } from "../../store/booking/bookingSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyBookings = () => {
  const dispatch = useAppDispatch();
  const bookings = useAppSelector((state: RootState) => state.booking.bookings);
  const status = useAppSelector((state: RootState) => state.booking.status);
  const error = useAppSelector((state: RootState) => state.booking.error);

  // Fetch bookings only on initial mount
  useEffect(() => {
    if (status === "idle") {
      console.log("Initial fetchBookings triggered");
      dispatch(fetchBookings());
    }
  }, [dispatch]); // No status dependency to prevent refetch

  // Log state for debugging
  useEffect(() => {
    console.log("Redux state:", {
      status,
      error,
      bookings: bookings.map((b) => ({ id: b.id, roomType: b.room.type })),
    });
  }, [status, error, bookings]);

  // Check for duplicate IDs
  useEffect(() => {
    const idCounts = bookings.reduce((acc, booking) => {
      if (booking.id) {
        acc[booking.id] = (acc[booking.id] || 0) + 1;
      }
      return acc;
    }, {} as Record<number, number>);
    Object.entries(idCounts).forEach(([id, count]) => {
      if (count > 1) {
        console.warn(
          `Duplicate booking ID detected: ${id} (appears ${count} times)`
        );
      }
    });
  }, [bookings]);

  const handleCancel = useCallback(
    async (bookingId: number) => {
      console.log(`handleCancel triggered for booking ID ${bookingId}`);
      await dispatch(deleteBooking(bookingId));
    },
    [dispatch]
  );

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-[#B89D63] mb-6">My Bookings</h1>
      {status === "loading" ? (
        <div className="text-center text-lg text-gray-600">
          Loading bookings...
        </div>
      ) : status === "failed" ? (
        <div className="text-center text-lg text-red-600">
          <p>Error: {error}</p>
        </div>
      ) : bookings.length > 0 ? (
        <div className="space-y-6">
          {bookings.map((booking, index) => (
            <BookingCard
              key={
                booking.id
                  ? `booking-${booking.id}`
                  : `booking-idx-${index}-${booking.checkInDate || index}`
              }
              booking={booking}
              onCancel={handleCancel}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-lg text-gray-600">
          <p>You have no bookings yet.</p>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default MyBookings;
