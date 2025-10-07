import React from 'react';
import './App.css';
import { Routes, Route, Link } from "react-router-dom";
import PokemonList from "./components/PokemonList";
import PokemonDetail from "./components/PokemonDetail";
import GalleryView from "./components/GalleryView";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 text-gray-800">
      <header className="bg-sky-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wide">PokéDex Explorer</h1>
          <nav className="space-x-4">
            <Link className="hover:underline" to="/">List View</Link>
            <Link className="hover:underline" to="/gallery">Gallery</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<PokemonList />} />
          <Route path="/gallery" element={<GalleryView />} />
          <Route path="/pokemon/:id" element={<PokemonDetail />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;