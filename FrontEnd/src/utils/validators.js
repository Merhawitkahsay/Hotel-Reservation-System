/**
 * Validates guest creation data before sending to GET /api/guests
 */
export const validateGuestForm = (data) => {
  const errors = {};
  if (!data.first_name?.trim()) errors.first_name = "First name is required";
  if (!data.last_name?.trim()) errors.last_name = "Last name is required";
  if (!/^\S+@\S+\.\S+$/.test(data.email)) errors.email = "Invalid email format";
  if (!data.phone?.trim()) errors.phone = "Phone number is required";
  return errors;
};

/**
 * Ensures check-out is after check-in, matching SQL constraint
 */
export const validateStayDates = (checkIn, checkOut) => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  return end > start;
};

/**
 * Validates if number of guests exceeds database max_occupancy
 */
export const validateOccupancy = (count, max) => {
  return count > 0 && count <= max;
};