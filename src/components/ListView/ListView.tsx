/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import styles from '../../Styles/List.module.scss';
import axios from 'axios';
import { Pokemon } from '../../common/constant';
import ListItem from './ListItem';
import SearchContext from '../../common/searchContext';
import { pokemonDetailsCache } from './ListItem'; 
import { useNavigate } from 'react-router-dom';
import { shufflePokemon } from '../../common/common';

const PokemonList = () => {
  const searchTerm = React.useContext(SearchContext);
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [sortConfig, setSortConfig] = useState<{order: string, property: string}>({order: 'asc',property: 'name'});
  const [noDataToDisplay, setNoDataToDisplay] = useState<Boolean>(false);
  const [filteredPokemon, setFilteredPokemon] = useState(pokemonData);
  const navigate = useNavigate();

  const sortPokemonData = (data: Pokemon[]) => {
    if (!data || !data.length) {
      return [];
    } else {
      return data.sort((a, b) => {
        const aDetails = pokemonDetailsCache[a.name];
        const bDetails = pokemonDetailsCache[b.name];
        if (aDetails && bDetails) {
          if (sortConfig.property === 'name') {
            return sortConfig.order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
          } else if (sortConfig.property === 'height' || sortConfig.property === 'weight') {
            return sortConfig.order === 'asc' ? aDetails[sortConfig.property] - bDetails[sortConfig.property] : bDetails[sortConfig.property] - aDetails[sortConfig.property];
          }
        }
        return 0;
      });
    }
  };

  const handleCardClick = (name: string) => {
    navigate(`/mp2/detail/${name}`);
  }

  const fetchPokemon = async () => {
    try {
      const response = await axios.get<{ results: Pokemon[] }>(
        `https://pokeapi.co/api/v2/pokemon?limit=50&offset=${offset}`
      );
      setPokemonData((prevData) => {
        let pokeList = [...prevData, ...shufflePokemon(response.data.results)];
        const sortedAndFilteredData = sortPokemonData(
          searchTerm
          ? pokeList.filter((pokemon) => pokemon.name.startsWith(searchTerm.toLowerCase()))
          : pokeList
        );
        if (!sortedAndFilteredData.length) {
          setNoDataToDisplay(true);
        } else {
          setNoDataToDisplay(false);
        } 
        return sortedAndFilteredData;
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchPokemon();
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10) {
        setOffset((prevOffset) => prevOffset + 50);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [offset]);

  useEffect(() => {
    if (searchTerm) {
      const pokeList = pokemonData.filter((pokemon) => pokemon.name.startsWith(searchTerm.toLowerCase()))
      if (!pokeList.length) {
        setNoDataToDisplay(true)
      } else {
        setNoDataToDisplay(false)
      }
      setFilteredPokemon(pokeList);
    } else {
      setFilteredPokemon(pokemonData);
    }
  }, [searchTerm])

  useEffect(() => {
    let sortedData = sortPokemonData(pokemonData);
    if (searchTerm) {
      sortedData = sortedData.filter((pokemon) => pokemon.name.startsWith(searchTerm.toLowerCase()));
    }
    if (!sortedData.length) {
      setNoDataToDisplay(true);
    } else {
      setNoDataToDisplay(false);
    }
    setPokemonData(sortedData);
  }, [sortConfig]);

  return (
    <div>
      <div className={styles.sortContainer}>
        <select 
          className={styles.sortSelect}
          value={sortConfig.property} 
          onChange={(e) => setSortConfig(prevConfig => ({...prevConfig, property: e.target.value}))}
        >
          <option value="name">Name</option>
          <option value="height">Height</option>
          <option value="weight">Weight</option>
        </select>
        <select 
          className={styles.sortSelect}
          value={sortConfig.order} 
          onChange={(e) => setSortConfig(prevConfig => ({...prevConfig, order: e.target.value}))}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <ul className={styles.list}>
        {!noDataToDisplay ? (
          sortPokemonData(searchTerm ? filteredPokemon : pokemonData).map((pokemon, index) => (
            <div key={index} className={styles.listItemWrapper}>
              <ListItem 
                key={`pokemon-${index}`} 
                name={pokemon.name} 
                url={pokemon.url}
                onClick={() => handleCardClick(pokemon.name)}
              />
            </div>
          ))
        ) : (
          <div className={`${styles.pokemonCard} ${styles.noDataToDisplay}` }>
            <div>
              No Data to display
            </div>
          </div>
        )}
      </ul>
    </div>
  );
};

export default PokemonList;
