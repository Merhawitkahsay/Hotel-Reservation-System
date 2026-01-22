import React from 'react';
import { isAdmin } from '../../utils/helpers'; // Integrated

const UserManagement = () => {
  const currentUser = JSON.parse(localStorage.getItem('user'));

  return (
    <div>
      {/* Only show "Delete Staff" if the logged-in user is an Admin */}
      {isAdmin(currentUser) && (
        <button className="text-red-500">Delete Staff Member</button>
      )}
    </div>
  );
};

export default UserManagement;