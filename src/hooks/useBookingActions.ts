import { useAppDispatch } from "../store/hooks";
import { removeBooking } from "../store/booking/bookingSlice";
import axiosErrorHandler from "../utils/axiosErrorHandler";
import { toast } from "react-toastify";

export const useBookingActions = () => {
  const dispatch = useAppDispatch();

  const cancelBooking = async (bookingId: number) => {
    try {
      console.log(`Attempting to cancel booking ID ${bookingId}`);
      const response = await fetch(
        `http://localhost:5000/bookings/${bookingId}`,
        {
          method: "DELETE",
        }
      );

      const responseText = await response.text();
      console.log(`DELETE /booking/${bookingId} response:`, {
        status: response.status,
        ok: response.ok,
        body: responseText || "Empty response",
      });

      if (!response.ok) {
        const errorData = responseText
          ? JSON.parse(responseText)
          : {
              message: `Failed to cancel booking (status: ${response.status})`,
            };
        if (response.status === 404) {
          console.warn(
            `Booking ID ${bookingId} not found on server. Removing from store.`
          );
          dispatch(removeBooking(bookingId));
          toast.warn(
            `Booking ID ${bookingId} not found on server, but removed locally.`
          );
          return;
        }
        throw new Error(
          errorData.message ||
            `Failed to cancel booking (status: ${response.status})`
        );
      }

      // Verify response body (should be empty or {})
      if (responseText && responseText !== "{}") {
        console.warn(
          `Unexpected response body for DELETE /booking/${bookingId}:`,
          responseText
        );
      }

      console.log(`Booking ID ${bookingId} deleted successfully from server.`);
      dispatch(removeBooking(bookingId));
      toast.success(`Booking ID ${bookingId} canceled successfully!`);
    } catch (error: unknown) {
      const errorMessage = axiosErrorHandler(error);
      console.error("Cancel booking error:", {
        bookingId,
        message: errorMessage,
      });
      toast.error(`Failed to cancel booking ID ${bookingId}: ${errorMessage}`);
    }
  };

  return { cancelBooking };
};
