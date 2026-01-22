import React, { useState } from 'react';
import { validateStayDates, validateOccupancy } from '../../utils/validator'; 
import { calculateNights } from '../../utils/helpers'; 
import { formatCurrency } from '../../utils/formatter'; 

const BookRoom = () => {
  const [errors, setErrors] = useState({});

  const handleBooking = (e) => {
    e.preventDefault();
    
    // Validate dates based on SQL constraints (Check-out > Check-in)
    if (!validateStayDates(formData.check_in_date, formData.check_out_date)) {
      setErrors({ dates: "Check-out must be after check-in" });
      return;
    }

    const nights = calculateNights(formData.check_in_date, formData.check_out_date);
    console.log(`Total Stay: ${nights} nights`);
    // ... API call
  };

  return (
    // Example of showing the nights count
    <div className="text-sm text-gray-500">
      Total Stay: {formData.check_in_date && formData.check_out_date ? 
        `${calculateNights(formData.check_in_date, formData.check_out_date)} Nights` : '0 Nights'}
    </div>
  );
};