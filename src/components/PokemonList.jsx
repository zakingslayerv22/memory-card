import { useState, useEffect } from "react";
import "../PokemonList.css";

export default function PokemonList({
  pokemonLimit,
  onPokemonSelect,
  currentScore,
  highScore,
}) {
  const [pokemonList, setPokemonList] = useState([]);

  const getPokemonImageUrl = (id) => {
    const paddedId = id.toString().padStart(3, "0");
    return `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${paddedId}.png`;
  };

  //Fisher Yates Algorithm
  const shuffle = (array) => {
    const arrayToShuffle = [...array];
    let i = arrayToShuffle.length;

    while (--i > 0) {
      const j = Math.floor(Math.random() * (i + 1));
      [arrayToShuffle[i], arrayToShuffle[j]] = [
        arrayToShuffle[j],
        arrayToShuffle[i],
      ];
    }
    // console.log(arrayToShuffle);
    return arrayToShuffle;
  };

  const handleClick = ({ target }) => {
    setPokemonList((pokemonList) => shuffle(pokemonList));
    onPokemonSelect(target.id);
  };

  useEffect(() => {
    const fetchPokemon = async () => {
      const url = `https://pokeapi.co/api/v2/pokemon-species?limit=${pokemonLimit}`;

      try {
        const speciesResponse = await fetch(url, { mode: "cors" });

        if (!speciesResponse.ok) {
          throw new Error(`Error fetching species: ${speciesResponse.status}`);
        }
        const speciesList = await speciesResponse.json();

        const fetchPromises = speciesList.results.map((specie) =>
          fetch(specie.url, { mode: "cors" })
        );
        const pokemonResponses = await Promise.all(fetchPromises);

        for (const response of pokemonResponses) {
          if (!response.ok) {
            throw new Error(`Error fetching detail: ${response.status}`);
          }
        }

        const jsonPromises = pokemonResponses.map((pokemonResponse) => {
          return pokemonResponse.json();
        });
        const pokemonDetails = await Promise.all(jsonPromises);

        setPokemonList(pokemonDetails);
      } catch (error) {
        console.log("Error:", error);
      }
    };

    fetchPokemon();
  }, [pokemonLimit]);

  return (
    <div>
      <div className="scoreboard">
        <strong>
          <div className="score">Score: {currentScore}</div>
        </strong>
        <strong>
          <div className="score">High Score: {highScore}</div>
        </strong>
      </div>
      <div className="pokemon-container">
        {pokemonList.map((pokemon) => (
          <div
            key={pokemon.id}
            id={pokemon.id}
            className="pokemon"
            onClick={handleClick}
          >
            <p id={pokemon.id}>{pokemon.name}</p>
            <img
              src={getPokemonImageUrl(pokemon.id)}
              id={pokemon.id}
              alt={pokemon.name}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
