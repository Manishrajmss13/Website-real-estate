import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileMenu = ({ user, logout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const navigateToFavourites = () => {
    navigate('/favourites');
    setDropdownOpen(false); // Close the dropdown after navigation
  };

  const navigateToBookings = () => {
    navigate('/bookings');
    setDropdownOpen(false); // Close the dropdown after navigation
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={dropdownRef}>
      <img 
        src={user?.picture} 
        alt='user image' 
        onClick={toggleDropdown} 
        style={{ 
          width: '40px', 
          height: '40px', 
          borderRadius: '50%', 
          cursor: 'pointer' 
        }} 
      />
      {dropdownOpen && (
        <div style={{ 
          position: 'absolute', 
          top: '50px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          backgroundColor: 'white', 
          border: '1px solid #ccc', 
          borderRadius: '8px', 
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', 
          zIndex: 1000 
        }}>
          <div 
            style={{ 
              padding: '10px 20px', 
              cursor: 'pointer', 
              color: 'black',
              transition: 'background-color 0.3s'
            }}
            onClick={navigateToFavourites}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            Favourites
          </div>
          <div 
            style={{ 
              padding: '10px 20px', 
              cursor: 'pointer', 
              color: 'black',
              transition: 'background-color 0.3s'
            }}
            onClick={navigateToBookings}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            Bookings
          </div>
          <div 
            style={{ 
              padding: '10px 20px', 
              cursor: 'pointer', 
              color: 'black',
              transition: 'background-color 0.3s'
            }}
            onClick={() => {
              localStorage.clear();
              logout();
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            Logout
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
