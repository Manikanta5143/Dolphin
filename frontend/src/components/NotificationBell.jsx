import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaBellSlash } from 'react-icons/fa';
import { useNotification } from '../context/NotificationContext';
import NotificationList from './NotificationList';
import { useNavigate } from 'react-router-dom';

const NotificationBell = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/notifications');
  };
  return (
    <div>
      <FaBell className="w-8 h-8 text-gray-700 cursor-pointer hover:text-primary-600 bg-gray-200 rounded-full p-1" onClick={handleClick} />
    </div>
  );
};

export default NotificationBell;