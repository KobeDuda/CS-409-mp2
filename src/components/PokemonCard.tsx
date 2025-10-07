import { Link } from "react-router-dom";
import { formatPokemonName } from "../formatPokemonName";

interface PokemonCardProps {
  id: number;
  name: string;
  sprite: string;
}

export default function PokemonCard({ id, name, sprite }: PokemonCardProps) {
  return (
    <Link
      to={`/pokemon/${id}`}
      className="bg-white rounded-2xl shadow hover:shadow-lg transition p-4 flex flex-col items-center"
    >
      <img src={sprite} alt={name} className="w-24 h-24 mb-2" loading='lazy'/>
      <h2 className="text-lg font-semibold">{formatPokemonName(name)}</h2>
      <p className="text-gray-500 text-sm">#{id}</p>
    </Link>
  );
}