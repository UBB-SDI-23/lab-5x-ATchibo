import { Route, Navigate, Routes } from 'react-router-dom';
import LocalStorageManager from './LocalStorageManager';

type ProtectedRouteProps = {
  element: any;
};

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
//   element: Element,
// }) => {
//   const isAuthenticated = LocalStorageManager.getAuthToken() !== null;

//   return isAuthenticated ? (
//     <Routes><Route index element={Element} /></Routes>
//   ) : (
//     <Navigate to="/login" />
//   );
// };

const ProtectedRoute = (props: any) => {
    const isAuthenticated = LocalStorageManager.getAuthToken() !== null;

    if (isAuthenticated)  
        return (
            <>
                {props.children}
            </>
        );
    else
        return (
            <Navigate to="/login" />
        );
};

export default ProtectedRoute;
