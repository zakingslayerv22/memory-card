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
    <div className="game-container">
      <div className="title-and-scoreboard">
        <h1>Pokemon Memory Game</h1>
        <div className="scoreboard">
          <strong>
            <p className="current-score">Score: {currentScore}</p>
          </strong>
          <strong>
            <p className="high-score">High Score: {highScore}</p>
          </strong>
        </div>
      </div>
      <p className="game-description">
        Get points by clicking on these species. Don't click an image more than
        once!
      </p>
      <div className="pokemon-container">
        {pokemonList.map((pokemon) => (
          <div
            key={pokemon.id}
            id={pokemon.id}
            className="pokemon"
            onClick={handleClick}
          >
            <img
              src={getPokemonImageUrl(pokemon.id)}
              id={pokemon.id}
              alt={pokemon.name}
            />
            <p id={pokemon.id} className="pokemon-name">
              {pokemon.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
