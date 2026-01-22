/**
 * Room Statuses matching room_status_enum
 */
export const ROOM_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  MAINTENANCE: 'maintenance',
  CLEANING: 'cleaning'
};

/**
 * Reservation Statuses matching reservation_status_enum
 */
export const RESERVATION_STATUS = {
  CONFIRMED: 'confirmed',
  CHECKED_IN: 'checked-in',
  CHECKED_OUT: 'checked-out',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no-show'
};

/**
 * User Roles matching the roles table
 */
export const ROLES = {
  ADMIN: 'admin',
  RECEPTIONIST: 'receptionist',
  GUEST: 'guest'
};

/**
 * Payment Methods matching payment_method_enum
 */
export const PAYMENT_METHODS = [
  'cash', 'credit_card', 'debit_card', 'bank_transfer', 'online_payment', 'voucher'
];