export type User = {
  id: number;
  email: string;
  full_name: string;
  phone: string | null;
  role: "user" | "admin";
  is_active: boolean;
  created_at: string;
};

export type Route = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description_short: string;
  description_long: string;
  province_scope: string;
  distance_km: number;
  estimated_days_min: number;
  estimated_days_max: number;
  hero_image_url: string;
  status: string;
  public_teaser_enabled: boolean;
  private_map_enabled: boolean;
  min_stamps_to_complete: number;
};

export type PassportType = {
  id: number;
  route_id: number;
  code: string;
  name: string;
  description: string;
  price_cents: number;
  currency: string;
  max_holders: number;
  holder_type: string;
  is_physical: boolean;
  is_active: boolean;
  sort_order: number;
};

export type StampPoint = {
  id: number;
  name: string;
  slug: string;
  description_public: string;
  description_private?: string;
  category: string;
  address?: string;
  city: string;
  province: string;
  lat: number;
  lng: number;
  is_active?: boolean;
  is_public_preview: boolean;
};

export type InterestPoint = {
  id: number;
  name: string;
  slug: string;
  point_type: string;
  summary: string;
  description?: string;
  address?: string;
  city: string;
  province: string;
  lat: number;
  lng: number;
  website_url?: string | null;
  contact_phone?: string | null;
  schedule_notes?: string | null;
  parking_notes?: string | null;
  access_notes?: string | null;
  pet_friendly?: boolean;
  is_public_preview: boolean;
  is_active?: boolean;
  sort_order?: number;
};

export type Passport = {
  id: number;
  route_id: number;
  route_title: string;
  passport_type_name: string;
  serial_number: string;
  owner_display_name: string | null;
  start_date: string | null;
  operational_status: string;
  stamp_status: string;
  activated_at: string | null;
  completed_at: string | null;
  stamps_count: number;
  required_stamps: number;
  progress_percent: number;
};

export type Stamp = {
  id: number;
  stamp_point_id: number;
  stamp_point_name: string;
  stamped_at: string;
  validation_status: string;
  scan_source: string;
};

export type PassportDetail = {
  passport: Passport;
  route: Route;
  stamp_points: StampPoint[];
  stamps: Stamp[];
  common_passport_qr_url: string;
};

export type OrderItem = {
  id: number;
  route_id: number;
  route_title: string;
  passport_type_id: number;
  passport_type_name: string;
  quantity: number;
  unit_price_cents: number;
  total_cents: number;
};

export type Order = {
  id: number;
  buyer_email: string;
  buyer_name: string;
  buyer_phone: string | null;
  status: string;
  fulfillment_status: string;
  tracking_code: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  total_cents: number;
  currency: string;
  created_at: string;
  items: OrderItem[];
};

export type AdminOrder = Order & {
  admin_notes: string | null;
};

export type AdminOrderPassport = {
  id: number;
  serial_number: string;
  passport_type_name: string;
  operational_status: string;
  activated_at: string | null;
  activated_by_user_id: number | null;
  activated_by_user_name: string | null;
  activated_by_user_email: string | null;
};

export type AdminOrderDetail = AdminOrder & {
  payments: Payment[];
  passports: AdminOrderPassport[];
};

export type AdminUserListItem = User & {
  passport_status: string;
  active_passports_count: number;
  last_route_title: string | null;
  last_stamp_at: string | null;
};

export type AdminUserPassportDetail = {
  passport: Passport;
  route: Route;
  stamp_points: StampPoint[];
  stamps: Stamp[];
};

export type AdminUserDetail = {
  user: User;
  passport_status: string;
  active_passports_count: number;
  total_stamps: number;
  orders: Order[];
  passport_details: AdminUserPassportDetail[];
};

export type AdminActivePassportListItem = {
  passport: Passport;
  user: User;
  last_stamp: Stamp | null;
  last_stamp_point: StampPoint | null;
};

export type AdminActivePassportDetail = {
  passport: Passport;
  user: User;
  route: Route;
  stamp_points: StampPoint[];
  stamps: Stamp[];
  last_stamp: Stamp | null;
  last_stamp_point: StampPoint | null;
};

export type Payment = {
  id: number;
  order_id: number;
  provider: string;
  method: string;
  amount_cents: number;
  currency: string;
  status: string;
};

export type AdminSummary = {
  users: number;
  routes: number;
  orders: number;
  active_passports: number;
  stamps: number;
};

export type SessionPayload = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
};
