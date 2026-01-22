import { ROLES } from './constants';

/**
 * Checks if a user has admin privileges
 */
export const isAdmin = (user) => user?.role === ROLES.ADMIN;

/**
 * Checks if a user is part of the staff (Admin or Receptionist)
 */
export const isStaff = (user) => [ROLES.ADMIN, ROLES.RECEPTIONIST].includes(user?.role);

/**
 * Calculates number of nights between check-in and check-out
 */
export const calculateNights = (checkIn, checkOut) => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};