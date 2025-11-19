import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import PokemonList from "./components/PokemonList";
// import './index.css'
// import App from './App.jsx'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <App /> */}
    <PokemonList />
  </StrictMode>
);
