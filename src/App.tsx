import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';

import HomePage from './pages/HomePage';
import NoPage from './pages/NoPage';
import StatisticsPage from './pages/StatisticsPage';
import TableManagementPage from './pages/TableManagementPage';

function App() {

  return (
    <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Header />}>
              <Route index element={<HomePage />} />
              <Route path="/manage-tables" element={<TableManagementPage />} />
              <Route path="/statistics" element={<StatisticsPage />} />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
