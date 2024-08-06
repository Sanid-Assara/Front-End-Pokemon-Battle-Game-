import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PokemonCards from './PokemonCard';

const HomePage = () => {
    const [pokemonList, setPokemonList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch Pokémon data from PokeAPI
    const fetchPokemon = async () => {
        try {
            const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100');
            const pokemonsWithDetails = await Promise.all(response.data.results.map(async (pokemon) => {
                const detailResponse = await axios.get(pokemon.url);
                return { ...pokemon, ...detailResponse.data }; 
            }));
            setPokemonList(pokemonsWithDetails);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPokemon();
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Function to render content
    const renderContent = () => {
        if (loading) {
            return <div className="animate-spin">Loading Pokémon...</div>;
        }

        if (error) {
            return (
                <div className="text-red-500">
                    <p>An error occurred: {error}</p>
                    <button onClick={fetchPokemon} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Retry</button>
                </div>
            );
        }

        // Filter Pokémon list based on search term
        const filteredPokemonList = pokemonList.filter(pokemon =>
            pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {filteredPokemonList.map(pokemon => (
                    <PokemonCards key={pokemon.id} pokemon={pokemon} /> //Use the PokemonCards component
                ))}
            </ul>
        );
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Pokémon List</h1>
            <input
                type="text"
                placeholder="Search Pokémon..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="border border-gray-300 rounded-lg p-2 mb-4 w-full md:w-1/2" 
            />
            {renderContent()}
        </div>
    );
};

export default HomePage;