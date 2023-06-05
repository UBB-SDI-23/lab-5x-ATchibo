import { createTheme } from '@mui/material';
import { ThemeProvider } from '@mui/system';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/headers/Header';

import HomePage from './pages/HomePage';
import NoPage from './pages/NoPage';
import StatisticsPage from './pages/StatisticsPage';
import TableManagementPage from './pages/TableManagementPage';
import Values from './Values';
import DealershipDetailsPage from './pages/DealershipDetailsPage';
import CarDetailsPage from './pages/CarDetailsPage';
import EmployeeDetailsPage from './pages/EmployeeDetailsPage';
import ContractDetailsPage from './pages/ContractDetailsPage';
import SupplierDetailsPage from './pages/SupplierDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountConfirmationPage from './pages/AccountConfirmationPage';
import UserInfoPage from './pages/UserInfoPage';
import ProtectedRoute from './helpers/ProtectedRoute';
import ManageUsersPage from './pages/ManageUsersPage';
import ManageDatabasePage from './pages/ManageDatabasePage';
import ChatPage from './pages/ChatPage';

function App() {

  const theme = createTheme({
    palette: {
      primary: {
        light: '#aaaaaa',
        main: Values.mainColor,
        dark: '#002884',
        contrastText: '#fff',
      },
      secondary: {
        light: '#aaaaaa',
        main: Values.secondaryColor,
        dark: '#ba000d',
        contrastText: '#fff',
      },
      success: {
        light: '#81c784',
        main: '#4caf50',
        dark: '#388e3c',
        contrastText: '#fff',
      },
      warning: {
        light: '#ffb74d',
        main: '#ff9800',
        dark: '#f57c00',
        contrastText: '#fff',
      },
      error: {
        light: '#e57373',
        main: '#f44336',
        dark: '#c62828',
        contrastText: '#fff',
      },
    },
  });
  

  return (
    <div className="App">
        <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path={Values.loginPageUrl} element={<LoginPage />} />
            <Route path={Values.registerPageUrl} element={<RegisterPage />} />
            <Route path={Values.activateAccountUrl + "/:token"} element={<AccountConfirmationPage />} />
            <Route path={Values.homePageUrl} element={<ProtectedRoute><Header/></ProtectedRoute>} >
              <Route index element={<ProtectedRoute><HomePage/></ProtectedRoute>}/>
              <Route path={Values.manageTablesUrl} element={<ProtectedRoute><TableManagementPage/></ProtectedRoute>}></Route>
              <Route path={Values.manageTablesUrl + "/dealerships/:dId"} element={<ProtectedRoute><DealershipDetailsPage/></ProtectedRoute>}/>
              <Route path={Values.manageTablesUrl + "/cars/:cId"} element={<ProtectedRoute><CarDetailsPage/></ProtectedRoute>}/>
              <Route path={Values.manageTablesUrl + "/employees/:eId"} element={<ProtectedRoute><EmployeeDetailsPage/></ProtectedRoute>}/>
              <Route path={Values.manageTablesUrl + "/contracts/:cId"} element={<ProtectedRoute><ContractDetailsPage/></ProtectedRoute>}/>
              <Route path={Values.manageTablesUrl + "/suppliers/:dId"} element={<ProtectedRoute><SupplierDetailsPage/></ProtectedRoute>}/>
              <Route path={Values.statisticsUrl} element={<ProtectedRoute><StatisticsPage/></ProtectedRoute>}/>
              <Route path={Values.manageUsersPageUrl} element={<ProtectedRoute><ManageUsersPage/></ProtectedRoute>}/>
              <Route path={Values.usersPageUrl + "/:uId"} element={<ProtectedRoute><UserInfoPage/></ProtectedRoute>}/>
              <Route path={Values.manageDatabasePageUrl} element={<ProtectedRoute><ManageDatabasePage/></ProtectedRoute>}/>
              <Route path={Values.chatPageUrl} element={<ProtectedRoute><ChatPage/></ProtectedRoute>}/>
              <Route path="*" element={<ProtectedRoute><NoPage/></ProtectedRoute>} />
            </Route>
          </Routes>
        </BrowserRouter>
        </ThemeProvider>
    </div>
  );
}

export default App;
