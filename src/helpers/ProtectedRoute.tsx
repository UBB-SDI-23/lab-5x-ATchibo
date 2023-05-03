import { Navigate } from 'react-router-dom';
import LocalStorageManager from './LocalStorageManager';
import React from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {

    const isAuthenticated = LocalStorageManager.getAuthToken() !== null;

    if (!isAuthenticated) {
        return (
            <Navigate to="/login"/>
        );
    }

    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    );
}

export default ProtectedRoute;
