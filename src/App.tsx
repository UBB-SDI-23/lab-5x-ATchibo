import { createTheme } from '@mui/material';
import { ThemeProvider } from '@mui/system';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';

import HomePage from './pages/HomePage';
import NoPage from './pages/NoPage';
import StatisticsPage from './pages/StatisticsPage';
import TableManagementPage from './pages/TableManagementPage';
import Values from './Values';
import DealershipDetailsPage from './pages/DealershipDetailsPage';

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
            <Route path={Values.homePageUrl} element={<Header />}>
              <Route index element={<HomePage />} />
              <Route path={Values.manageTablesUrl} element={<TableManagementPage />}></Route>
              <Route path={Values.manageTablesUrl + "/dealerships/:dId"} element={<DealershipDetailsPage />}/>
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
