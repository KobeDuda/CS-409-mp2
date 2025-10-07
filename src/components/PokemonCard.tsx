import { Link } from "react-router-dom";
import { formatPokemonName } from "../formatPokemonName";

interface PokemonCardProps {
  id: number;
  name: string;
  sprite: string;
  mode?: "list" | "gallery";
}

export default function PokemonCard({ id, name, sprite, mode = "gallery" }: PokemonCardProps) {
  return (
    <Link
      to={`/pokemon/${id}`}
      className={`
        block rounded-2xl shadow hover:shadow-lg transition
        bg-white overflow-hidden
        ${mode === "list" ? "w-full flex items-center p-4" : "w-48 flex flex-col items-center p-3"}
      `}
    >
      <img
        src={sprite}
        alt={name}
        className={`
          ${mode === "list" ? "w-20 h-20 mr-4" : "w-32 h-32 mb-2"}
          object-contain
        `}
      />
      <div className={mode === "list" ? "flex flex-col" : "text-center"}>
        <h2 className="text-lg font-semibold capitalize">{formatPokemonName(name)}</h2>
        <p className="text-gray-500">#{id}</p>
      </div>
    </Link>
  );
}