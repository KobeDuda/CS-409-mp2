import React from 'react';
import logo from './logo.svg';
import './App.css';
import { homedir } from 'os';
import axios from 'axios';
import { fetchWithCache } from './cache';
import PokemonList from './PokemonList';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PokemonDetail from './PokemonDetail';

const App: React.FC = () => {
  return (
      <Routes>
        <Route path="/" element={<PokemonList />} />
        <Route path="/pokemon/:id" element={<PokemonDetail />} />
      </Routes>
  );
};

export default App;