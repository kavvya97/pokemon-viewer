import React from 'react';
import axios from 'axios';

export const fetchPokemonData = async (limit: number, offset: number) => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
      return response;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
};