import { useState } from "react";
import PokemonList from "./PokemonList";

export function PokemonGame() {
  const [selectedPokemonIds, setSelectedPokemonIds] = useState([]);
  const [score, setScore] = useState({ current: 0, high: 0 });

  const handleGuess = (currentId) => {
    const hasBeenSelected = selectedPokemonIds.includes(currentId);

    if (!hasBeenSelected) {
      setSelectedPokemonIds([...selectedPokemonIds, currentId]);
      setScore({ ...score, current: score.current + 1 });
    } else {
      setSelectedPokemonIds([]);
      setScore({ current: 0, high: Math.max(score.high, score.current) });
    }
  };

  return (
    <>
      <PokemonList
        pokemonLimit={12}
        onPokemonSelect={handleGuess}
        currentScore={score.current}
        highScore={score.high}
      />
    </>
  );
}
