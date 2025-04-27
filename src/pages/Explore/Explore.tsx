import { useExplore } from "./ExploreBuildComponents/useExplore";
import ExploreHotelDetails from "./ExploreHotelDetails";
import ExploreRoomDetails from "./ExploreBuildComponents/ExploreRoomDetails";

const Explore = () => {
  // use Explore hook to get hotel details
  const { hotel, loading, error } = useExplore();

  // Handling loading, error, and hotel data
  if (loading === "pending") {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-20">{error}</div>;
  }

  if (!hotel) {
    return <div className="text-center py-20">No hotel details found.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 text-[#2e2e2e]">
      {/* Hotel details */}
      <ExploreHotelDetails hotel={hotel} />

      {/* Rooms */}
      <ExploreRoomDetails rooms={hotel.rooms} hotel={hotel} />

      {/* Cancellation Policy */}
      <div className="mt-8 bg-[#f9f6f1] rounded-xl p-5 border-l-4 border-[#B89D63]">
        <h2 className="text-lg font-semibold mb-2 text-[#B89D63]">
          Cancellation Policy
        </h2>
        <p className="text-sm text-gray-700">
          Free cancellation is available up to 48 hours before the check-in
          date. If you cancel within 48 hours of check-in, a cancellation fee
          equivalent to one night's stay will be charged. No-shows or same-day
          cancellations are non-refundable. Please contact the property directly
          for any emergency or exceptional cases. Policies may vary depending on
          the specific hotel, room type, or seasonal demand.
        </p>
      </div>
    </div>
  );
};

export default Explore;
