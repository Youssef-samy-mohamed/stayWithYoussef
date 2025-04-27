import useHome from "./useHome";
import FindMoreDetails from "./FindMoreDetails";
import { images } from "../../assets/images/index";
import { ResuableHeader } from "../../components/common";

const Home = () => {
  const { hotels, loading, error } = useHome();

  if (loading === "pending")
    return <div className="text-center text-xl">Loading hotels...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;



  return (
    <>
      <div className="text-center text-white bg-gradient-to-r from-[#B89D63] to-[#FFD700] shadow-lg py-12 rounded-md mb-8">
        <ResuableHeader title="Find Your Perfect Stay 👀" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8">
        {hotels.map((hotel, index) => (
          <div
            key={hotel.id}
            className="relative rounded-2xl overflow-hidden bg-white transition-transform hover:scale-[1.02]"
            style={{
              boxShadow:
                "0px 10px 20px rgba(184, 157, 99, 0.3), 0px 4px 6px rgba(184, 157, 99, 0.2)",
            }}
          >
            {/* Hotel Image */}
            <img
              src={images[index % images.length]}
              alt={hotel.name}
              className="w-full h-48 object-cover"
            />

            {/* Hotel Details */}
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {hotel.name}
              </h2>

              <p className="text-sm text-gray-700 mb-2">
                <span className="font-semibold">Location:</span>{" "}
                {hotel.location}
              </p>

              <p className="text-sm text-gray-700 mb-2">
                <span className="font-semibold">
                  Average Price: {hotel.average_price} {hotel.currency}{" "}
                </span>
              </p>

              <p className="text-sm text-gray-700 mb-4">
                <span className="font-semibold">Rating:</span> {hotel.rating} /
                5
              </p>
              {/* navigate to explore  */}
              <FindMoreDetails hotelId={hotel.id} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
    
};

export default Home;
