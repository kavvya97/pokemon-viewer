import React, { useState, useEffect } from 'react';
import styles from '../../Styles/List.module.scss';
import axios from 'axios';
import { Pokemon } from '../../common/constant';
import ListItem from './ListItem';
import SearchContext from '../../common/searchContext';
import { pokemonDetailsCache } from './ListItem'; 
import { useNavigate } from 'react-router-dom';

const PokemonList = () => {
  const searchTerm = React.useContext(SearchContext);
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
  const [limit, setLimit] = useState<number>(50);
  const [offset, setOffset] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [sortProperty, setSortProperty] = useState<string>('name');
  const [noDataToDisplay, setNoDataToDisplay] = useState<Boolean>(false);
  const navigate = useNavigate();


  function shuffleArray(array: Pokemon[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];  // Swap elements
    }
    return array;
  }

  const sortPokemonData = (data: Pokemon[]) => {
    if (!data || !data.length) {
      return []
    } else {
      return data.sort((a, b) => {
        const aDetails = pokemonDetailsCache[a.name];
        const bDetails = pokemonDetailsCache[b.name];
        if (aDetails && bDetails) {
          if (sortProperty === 'name') {
            return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
          } else if (sortProperty === 'height' || sortProperty === 'weight') {
            return sortOrder === 'asc' ? aDetails[sortProperty] - bDetails[sortProperty] : bDetails[sortProperty] - aDetails[sortProperty];
          }
        }
        return 0;
      });
    }
  };

  const handleCardClick = (name: string) => {
    navigate(`/detail/${name}`);
  }


  const fetchPokemon = async () => {
    try {
      const response = await axios.get<{ results: Pokemon[] }>(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
      );
      setPokemonData((prevData) => {
        let pokeList = [...prevData, ...shuffleArray(response.data.results)];
        const sortedAndFilteredData = sortPokemonData(
          searchTerm
          ? pokeList.filter((pokemon) => pokemon.name.startsWith(searchTerm.toLowerCase()))
          : pokeList
        );
        if (!sortedAndFilteredData.length) {
          setNoDataToDisplay(true);
        }
        setNoDataToDisplay(false);
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
  }, [limit, offset, searchTerm, sortProperty, sortOrder]);

  return (
    <div>
      <div className={styles.sortContainer}>
        <select 
          className={styles.sortSelect}
          value={sortProperty} 
          onChange={(e) => setSortProperty(e.target.value)}
        >
          <option value="name">Name</option>
          <option value="height">Height</option>
          <option value="weight">Weight</option>
        </select>
        <select 
          className={styles.sortSelect}
          value={sortOrder} 
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <ul className={styles.list}>

        {!noDataToDisplay ? (
          sortPokemonData(pokemonData).map((pokemon, index) => (
          <div key={index} className={styles.listItemWrapper}>
            <ListItem 
              key={`pokemom-${index}`} 
              name={pokemon.name} 
              url={pokemon.url}
              onClick={() => handleCardClick(pokemon.name)}
            />
          </div>
        ))): (
          <div className={`${styles.pokemonCard} ${styles.nodataToDisplay}` }>
            <div>
              No Data to display
            </div>
          </div>
        ) 
      }
      </ul>
    </div>
  );
};

export default PokemonList;
