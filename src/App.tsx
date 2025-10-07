import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, Routes} from 'react-router-dom';
import { homedir } from 'os';
import axios from 'axios';
import { fetchWithCache } from './cache';
import PokemonList from './PokemonList';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <h1 className="text-3xl font-bold my-6">Pokémon Search</h1>
      <PokemonList />
    </div>
  );
}

export default App;