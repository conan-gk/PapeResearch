import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import PapersList from './components/PapersList';
import Paper from './components/Paper';
import Layout from "./Layout";
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/papers" element={<PapersList />} />
          <Route path="/paper/:id" element={<Paper />} />
        </Route>  
      </Routes>
    </Router>
  );
}

export default App;


// Root component of the React application. 
// Typically defines the main layout and structure of the app. 
// Contains the main component of the application, which can be composed of other components to build the UI.