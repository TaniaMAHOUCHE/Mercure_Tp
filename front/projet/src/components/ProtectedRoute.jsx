import React from "react";
import {Navigate,Outlet} from 'react-router-dom';

export const ProtectedRoute = ({ user, redirectPath = '/inscription' }) => {
  
  if (!user) {
      return <Navigate to={redirectPath} replace />;
    }
  
    return <Outlet />;
  };
  