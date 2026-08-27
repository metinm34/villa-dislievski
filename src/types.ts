export interface Room {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  tagline: string;
  description: string;
  pricePerNight: number;
  originalPrice?: number;
  capacity: {
    adults: number;
    children: number;
  };
  sizeM2: number;
  viewType: 'Lake View' | 'Panoramic Lake & Castle' | 'Old Town View' | 'Secluded Garden';
  bedType: 'King Luxury Bed' | 'Imperial Super King' | 'Master King + Twin Option';
  floor: string;
  amenities: string[];
  highlightAmenities: {
    name: string;
    icon: string;
  }[];
  images: string[];
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
  badge?: string;
  features: string[];
}

export interface BookingAddOns {
  breakfast: boolean; // €25 / person / night
  lakeViewGuaranteed: boolean; // €30 / night
  privateAirportTransfer: boolean; // €45 one time
  spaAccess: boolean; // €35 / person
  champagneWelcome: boolean; // €60 one time
}

export type BookingStatus = 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
export type PaymentStatus = 'pay_at_property' | 'deposit_paid' | 'fully_paid';

export interface Booking {
  id: string;
  bookingReference: string;
  guestName: string;
  email: string;
  phone: string;
  country: string;
  roomId: string;
  roomName: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  nights: number;
  adultsCount: number;
  childrenCount: number;
  basePricePerNight: number;
  roomTotal: number;
  addOnsTotal: number;
  taxTotal: number;
  totalPrice: number;
  currency: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  specialRequests?: string;
  addOns: BookingAddOns;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'superadmin' | 'concierge' | 'manager';
}

export interface AdminStats {
  totalRevenue: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  checkedInBookings: number;
  cancelledBookings: number;
  occupancyRate: number;
  averageStayNights: number;
  averageDailyRate: number;
}
