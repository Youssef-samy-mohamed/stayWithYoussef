// types.ts
import { HotelDetails, Room } from "./hotelDetails";

export type Booking = {
  id?: number;
  userId?: string;
  hotelId: string;
  hotelName: string;
  hotel: HotelDetails;
  room: Room;
  roomType: string;
  bedType: string;
  pricePerNight: number;
  currency: string;
  numberOfGuests: number;
  checkInDate: string | null;
  checkOutDate: string | null;
  numberOfNights: number;
  totalPrice: number;
  checkIn: string;
  checkOut: string;
  createdAt?: string;
  status?: string;
};