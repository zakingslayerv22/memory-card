import { useState, useEffect } from "react";

export default function PokemonList() {
  const [pokemonList, setPokemonList] = useState([]);
  const pokemonLimit = 12;

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

  return <div></div>;
}
