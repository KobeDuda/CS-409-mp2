import React, { useState } from "react";
import axios from "axios";
import { fetchWithCache } from "./cache";

interface Pokemon {
  name: string;
  id: number;
  sprites: {
    front_default: string;
  };
  types: { type: { name: string } }[];
}

interface PokemonListItem {
  name: string;
  url: string;
}

interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

const PokemonSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;
    setError(null);
    setPokemon(null);
    setLoading(true);

    try {
      // lowercase names are required by PokeAPI
      const response = await axios.get<Pokemon>(
        `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`
      );
      setPokemon(response.data);
    } catch (err) {
      setError("Pokémon not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Pokémon..."
          className="border p-2 rounded text-lg"
        />
        <button
          type="submit"         className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {pokemon && (
        <div className="flex flex-col items-center border p-4 rounded shadow-md">
          <img
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            className="w-32 h-32"
          />
          <h2 className="text-2xl capitalize">{pokemon.name}</h2>
          <p>ID: {pokemon.id}</p>
          <p>
            Type:{" "}
            {pokemon.types.map((t) => t.type.name).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
};

export default PokemonSearch;