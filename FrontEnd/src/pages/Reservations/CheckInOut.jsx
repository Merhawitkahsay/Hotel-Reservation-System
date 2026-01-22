import React from 'react';
import { checkInGuest, checkOutGuest } from '../../services/reservationService';
import Button from '../../components/button';

const CheckInOut = ({ reservation, onUpdate }) => {
  const handleCheckIn = async () => {
    await checkInGuest(reservation.reservation_id);
    onUpdate();
  };

  const handleCheckOut = async () => {
    await checkOutGuest(reservation.reservation_id);
    onUpdate();
  };

  return (
    <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
      {reservation.status === 'confirmed' && (
        <Button onClick={handleCheckIn} variant="primary" className="flex-1">
          START CHECK-IN
        </Button>
      )}
      {reservation.status === 'checked-in' && (
        <Button onClick={handleCheckOut} variant="secondary" className="flex-1">
          FINALIZE CHECK-OUT
        </Button>
      )}
    </div>
  );
};

export default CheckInOut;