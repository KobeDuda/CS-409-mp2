import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

interface PokemonType {
  type: { name: string };
}

interface PokemonDetailData {
  name: string;
  id: number;
  sprites: {
    other?: {
      "official-artwork"?: { front_default?: string };
    };
  };
  types: PokemonType[];
}

interface PokemonSpeciesData {
  flavor_text_entries: {
    flavor_text: string;
    language: { name: string };
  }[];
  evolution_chain: { url: string };
}

interface EvolutionNode {
  species: { name: string; url: string };
  evolves_to: EvolutionNode[];
}

interface EvolutionChainResponse {
  chain: EvolutionNode;
}

interface EvolutionPokemon {
  name: string;
  id: number;
}

const PokemonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pokemon, setPokemon] = useState<PokemonDetailData | null>(null);
  const [description, setDescription] = useState<string>("");
  const [evolutions, setEvolutions] = useState<EvolutionPokemon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        // 1️⃣ Fetch Pokémon and Species data
        const [pokemonRes, speciesRes] = await Promise.all([
          axios.get<PokemonDetailData>(`https://pokeapi.co/api/v2/pokemon/${id}`),
          axios.get<PokemonSpeciesData>(`https://pokeapi.co/api/v2/pokemon-species/${id}`),
        ]);

        setPokemon(pokemonRes.data);

        // 2️⃣ English Pokédex description
        const englishEntry = speciesRes.data.flavor_text_entries.find(
          (entry) => entry.language.name === "en"
        );
        if (englishEntry) {
          setDescription(englishEntry.flavor_text.replace(/\f|\n/g, " ").trim());
        }

        // 3️⃣ Fetch evolution chain
        const evolutionUrl = speciesRes.data.evolution_chain.url;
        const evoRes = await axios.get<EvolutionChainResponse>(evolutionUrl);

        // Recursively traverse evolution chain
        const extractEvolutions = (node: EvolutionNode): EvolutionPokemon[] => {
          const idMatch = node.species.url.match(/\/pokemon-species\/(\d+)\//);
          const pokeId = idMatch ? parseInt(idMatch[1], 10) : 0;
          const current: EvolutionPokemon = {
            name: node.species.name,
            id: pokeId,
          };
          const next = node.evolves_to.flatMap(extractEvolutions);
          return [current, ...next];
        };

        const evoList = extractEvolutions(evoRes.data.chain);
        setEvolutions(evoList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading || !pokemon)
    return <p className="text-center p-6">Loading Pokémon...</p>;

  const imageUrl =
    pokemon.sprites.other?.["official-artwork"]?.front_default ??
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

  return (
    <div className="flex flex-col items-center p-6">
      <Link to="/" className="self-start text-blue-500 hover:underline mb-4">
        ← Back to list
      </Link>

      <img src={imageUrl} alt={pokemon.name} className="w-48 h-48 mb-4" />

      <h1 className="text-4xl capitalize font-bold mb-2">
        {pokemon.name} <span className="text-gray-500">#{pokemon.id}</span>
      </h1>

      <div className="flex gap-2 mb-4">
        {pokemon.types.map((t) => (
          <span
            key={t.type.name}
            className="px-3 py-1 bg-gray-200 rounded-full capitalize text-sm"
          >
            {t.type.name}
          </span>
        ))}
      </div>

      {description && (
        <p className="max-w-xl text-center text-gray-700 mb-8">{description}</p>
      )}

      {/* Evolution chain */}
      {evolutions.length > 1 && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-3 text-center">
            Evolution Chain
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-4">
            {evolutions.map((evo, index) => (
              <React.Fragment key={evo.id}>
                <Link
                  to={`/pokemon/${evo.id}`}
                  className="flex flex-col items-center border rounded-xl p-2 bg-white shadow hover:shadow-md transition"
                >
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.id}.png`}
                    alt={evo.name}
                    className="w-16 h-16 object-contain mb-1"
                    loading="lazy"
                  />
                  <span className="capitalize text-sm font-medium">
                    {evo.name}
                  </span>
                </Link>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonDetail;
