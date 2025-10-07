import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { formatPokemonName } from "../formatPokemonName";

interface PokemonDetailData {
  id: number;
  name: string;
  sprite: string;
  types: string[];
  description: string;
  evolutions: {
    id: number;
    name: string;
    sprite: string;
  }[];
}

const PokemonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pokemon, setPokemon] = useState<PokemonDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        // Basic Pokémon data
        const basicRes = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = basicRes.data;

        const sprite =
          data.sprites.other?.["official-artwork"]?.front_default ||
          data.sprites.front_default ||
          "";

        const types = data.types.map((t: any) => t.type.name);

        // Try to fetch species info (for description + evolution chain)
        let description = "Description not available.";
        let evolutions: PokemonDetailData["evolutions"] = [];

        try {
          const speciesRes = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
          const speciesData = speciesRes.data;

          // Extract English flavor text
          const englishEntry = speciesData.flavor_text_entries.find(
            (entry: any) => entry.language.name === "en"
          );
          if (englishEntry) {
            description = englishEntry.flavor_text
              .replace(/\f/g, " ")
              .replace(/\n/g, " ");
          }

          // Fetch evolution chain (if exists)
          if (speciesData.evolution_chain?.url) {
            try {
              const evoRes = await axios.get(speciesData.evolution_chain.url);
              const evoData = evoRes.data;

              const extractEvolutions = (chain: any): any[] => {
                const evoList: any[] = [];
                let current = chain;

                while (current) {
                  evoList.push(current.species.name);
                  if (current.evolves_to.length > 0) {
                    current = current.evolves_to[0];
                  } else {
                    break;
                  }
                }
                return evoList;
              };

              const evoNames = extractEvolutions(evoData.chain);

              evolutions = await Promise.all(
                evoNames.map(async (name: string) => {
                  try {
                    const evoDetails = await axios.get(
                      `https://pokeapi.co/api/v2/pokemon/${name}`
                    );
                    const evoId = evoDetails.data.id;
                    const evoSprite =
                      evoDetails.data.sprites.other?.["official-artwork"]?.front_default ||
                      evoDetails.data.sprites.front_default ||
                      "";
                    return {
                      id: evoId,
                      name,
                      sprite: evoSprite,
                    };
                  } catch {
                    return {
                      id: -1,
                      name,
                      sprite: "",
                    };
                  }
                })
              );
            } catch (e) {
              console.warn("Evolution chain not found:", e);
            }
          }
        } catch (e) {
          console.warn(`Species data not found for Pokémon ID ${id}:`, e);
        }

        setPokemon({
          id: data.id,
          name: data.name,
          sprite,
          types,
          description,
          evolutions,
        });
      } catch (err) {
        console.error("Failed to load Pokémon:", err);
        setError("Failed to load Pokémon data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [id]);

  if (loading) return <p className="text-center p-6">Loading Pokémon...</p>;
  if (error) return <p className="text-center text-red-600 p-6">{error}</p>;
  if (!pokemon) return <p className="text-center p-6">No Pokémon data available.</p>;

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold capitalize mb-4">{formatPokemonName(pokemon.name)}</h1>
      <img
        src={pokemon.sprite}
        alt={pokemon.name}
        className="w-64 h-64 object-contain mb-4"
      />

      <div className="flex gap-2 mb-4">
        {pokemon.types.map((t) => (
          <span
            key={t}
            className="px-3 py-1 bg-gray-200 rounded-full capitalize text-sm"
          >
            {t}
          </span>
        ))}
      </div>

      <p className="max-w-xl text-center text-gray-700 mb-8">
        {pokemon.description || "Description not available."}
      </p>

      {pokemon.evolutions.length > 0 && (
        <div className="w-full max-w-3xl">
          <h2 className="text-2xl font-semibold text-center mb-4">Evolution Chain</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {pokemon.evolutions.map((evo) => (
              <Link
                key={evo.name}
                to={`/pokemon/${evo.id}`}
                className="flex flex-col items-center transition hover:scale-105"
              >
                <img
                  src={
                    evo.sprite ||
                    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png"
                  }
                  alt={evo.name}
                  className="w-24 h-24 object-contain mb-2"
                />
                <span className="capitalize">{evo.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonDetail;
