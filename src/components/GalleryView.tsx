import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface PokemonBasic {
  name: string;
  url: string;
}

interface PokemonData {
  id: number;
  name: string;
  sprite: string;
  types: string[];
}

const POKEMON_LIMIT = 10000; // number of pokemon to load initially

const GalleryView: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<PokemonData[]>([]);
  const [filteredTypes, setFilteredTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [allTypes, setAllTypes] = useState<string[]>([]);

  // Fetch the initial batch of Pokémon
  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const res = await axios.get<{ results: PokemonBasic[] }>(
          `https://pokeapi.co/api/v2/pokemon?limit=${POKEMON_LIMIT}`
        );

        // Fetch each Pokémon’s detailed data
        const pokemonData = await Promise.all(
          res.data.results.map(async (p) => {
            const details = await axios.get(`https://pokeapi.co/api/v2/pokemon/${p.name}`);
            const types = details.data.types.map((t: any) => t.type.name);
            return {
              id: details.data.id,
              name: details.data.name,
              sprite:
                details.data.sprites.other?.["official-artwork"]?.front_default ||
                details.data.sprites.front_default,
              types,
            };
          })
        );

        setPokemonList(pokemonData);

        // Collect all types seen
        const allUniqueTypes = Array.from(
          new Set(pokemonData.flatMap((p) => p.types))
        ).sort();
        setAllTypes(allUniqueTypes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, []);

  // Toggle filter selection
  const toggleType = (type: string) => {
    setFilteredTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Apply type filters
  const filteredList =
    filteredTypes.length === 0
      ? pokemonList
      : pokemonList.filter((p) => filteredTypes.every((t) => p.types.includes(t)));

  if (loading) return <p className="text-center p-6">Loading Pokémon...</p>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Pokémon Gallery</h1>

      {/* Type Filter Controls */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {allTypes.map((type) => (
          <button
            key={type}
            onClick={() => toggleType(type)}
            className={`px-3 py-1 rounded-full border text-sm capitalize transition 
              ${filteredTypes.includes(type)
                ? "bg-blue-500 text-white border-blue-600"
                : "bg-gray-200 hover:bg-gray-300 border-gray-300"
              }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {filteredList.map((p) => (
          <Link
            key={p.id}
            to={`/pokemon/${p.id}`}
            className="flex flex-col items-center p-3 border rounded-xl bg-white shadow hover:shadow-md transition"
          >
            <img
              src={p.sprite}
              alt={p.name}
              className="w-24 h-24 object-contain mb-2"
              loading="lazy"
            />
            <span className="capitalize font-medium">{p.name}</span>
            <div className="flex gap-1 mt-1">
              {p.types.map((t) => (
                <span
                  key={t}
                  className="text-xs bg-gray-100 rounded-full px-2 py-0.5 capitalize"
                >
                  {t}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GalleryView;
