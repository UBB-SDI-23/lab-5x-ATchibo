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
    },
  });
  

  return (
    <div className="App">
        <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path={Values.homePageUrl} element={<Header />}>
              <Route index element={<HomePage />} />
              <Route path={Values.manageTablesUrl} element={<TableManagementPage />} />
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
