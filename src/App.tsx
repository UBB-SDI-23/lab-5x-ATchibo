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
            <Route path={Values.homePageUrl} element={<Header />}>
              <Route index element={<HomePage />} />
              <Route path={Values.manageTablesUrl} element={<TableManagementPage />}></Route>
              <Route path={Values.manageTablesUrl + "/dealerships/:dId"} element={<DealershipDetailsPage />}/>
              <Route path={Values.manageTablesUrl + "/cars/:cId"} element={<CarDetailsPage />}/>
              <Route path={Values.manageTablesUrl + "/employees/:eId"} element={<EmployeeDetailsPage />}/>
              <Route path={Values.manageTablesUrl + "/contracts/:cId"} element={<ContractDetailsPage />}/>
              <Route path={Values.manageTablesUrl + "/suppliers/:dId"} element={<SupplierDetailsPage />}/>
              <Route path={Values.statisticsUrl} element={<StatisticsPage />} />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
        </ThemeProvider>
    </div>
  );
}

export default App;
