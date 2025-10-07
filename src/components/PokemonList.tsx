import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { formatPokemonName } from "../formatPokemonName";
import PokemonCard from "./PokemonCard";

interface PokemonListItem {
  name: string;
  url: string;
}

interface PokemonListResponse {
  results: PokemonListItem[];
}

type SortField = "name" | "id";
type SortOrder = "asc" | "desc";

const PokemonList: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  useEffect(() => {
    const fetchAllPokemon = async () => {
      setLoading(true);
      try {
        const response = await axios.get<PokemonListResponse>(
          "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0"
        );
        setPokemonList(response.data.results);
      } finally {
        setLoading(false);
      }
    };
    fetchAllPokemon();
  }, []);

  const getPokemonId = (url: string): number => {
    const match = url.match(/\/pokemon\/(\d+)\//);
    return match ? parseInt(match[1], 10) : 0;
  };

  const filteredAndSorted = useMemo(() => {
    const filtered = pokemonList.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
      let compareValue = 0;

      if (sortField === "name") {
        compareValue = a.name.localeCompare(b.name);
      } else {
        compareValue = getPokemonId(a.url) - getPokemonId(b.url);
      }

      return sortOrder === "asc" ? compareValue : -compareValue;
    });

    return sorted;
  }, [pokemonList, search, sortField, sortOrder]);

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4">Pokédex List</h1>

      <input
        type="text"
        placeholder="Search Pokémon..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded p-2 mb-4 w-64"
      />

      <div className="flex gap-4 mb-4">
        <label>
          Sort by:{" "}
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as SortField)}
            className="border rounded p-1"
          >
            <option value="id">ID</option>
            <option value="name">Name</option>
          </select>
        </label>

        <label>
          Order:{" "}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            className="border rounded p-1"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>

      {loading ? (
        <p>Loading Pokémon...</p>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-4xl">
          {filteredAndSorted.map((p) => {
            const id = getPokemonId(p.url);
            const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

            return (
              <PokemonCard id={id} name={p.name} sprite={spriteUrl} />
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default PokemonList;