import React, { useState, useEffect } from 'react';
import styles from '../../Styles/Gallery.module.scss';
import axios from 'axios';
import { Pokemon, PokemonSpecies, PokemonTypeFilter, pokeType } from '../../common/constant';
import GalleryItem from './GalleryItem';
import { useNavigate } from 'react-router-dom';

const PokemonList = () => {
  const navigate = useNavigate();
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [noDataToDisplay, setNoDataToDisplay] = useState<Boolean>(false);
  
  const types = ['fire', 'grass', 'water', 'poison', 'rock', 'ghost'];
  const habitats = ['cave', 'forest', 'grassland', 'mountain', 'rare','sea', 'urban'];

  function shuffleArray(array: Pokemon[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; 
    }
    return array;
  }

  const fetchPokemon = async () => {
    try {
      const response = await axios.get<{ results: Pokemon[] }>(
        `https://pokeapi.co/api/v2/pokemon?limit=50&offset=${offset}`
      );
      setPokemonData((prevData) => {
        let pokeList = [...prevData, ...shuffleArray(response.data.results)];
        setNoDataToDisplay(false);
        if (!pokeList.length) {
          setNoDataToDisplay(true);
        }
        return pokeList;
      });
    } catch (error) {
      console.error('Error fetching pokemon:', error);
    }
  };

  const fetchPokemonByHabitat = async (habitat: String) => {
    try {
      const response = await axios.get<PokemonSpecies>(
        `https://pokeapi.co/api/v2/pokemon-habitat/${habitat}`
      );
      const speciesList: Pokemon[] = response.data.pokemon_species.map((pokemon) => {
        const id = pokemon.url.split('/').slice(-2, -1)[0];
        const modifiedUrl = `https://pokeapi.co/api/v2/pokemon/${id}/`;
        return {
          name: pokemon.name,
          url: modifiedUrl
        };
      });
      if (!speciesList.length) {
        setNoDataToDisplay(true);
      }
      setNoDataToDisplay(false);
      setPokemonData(speciesList);
    } catch (error) {
      console.error('Error fetching pokemon habitat:', error);
    }
  };

  const fetchPokemonByType = async (type: String) => {
    try {
      const response = await axios.get<PokemonTypeFilter>(
        `https://pokeapi.co/api/v2/type/${type}`
      );
      console.log(response)
      const speciesList: Pokemon[] = response.data.pokemon.map((elem: pokeType) => {
        return {
          name: elem.pokemon.name,
          url: elem.pokemon.url
        };
      });
      setPokemonData(speciesList);
    } catch (error) {
      console.error('Error fetching pokemon habitat:', error);
    }
  }

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

  const handleHabitatClick = (habitat: string) => {
    fetchPokemonByHabitat(habitat); 
  };

  const handleGalleryCardClick = (name: string) => {
    navigate(`/detail/${name}`);
  }

  const handlePokemonTypes = (type: string) => {
    fetchPokemonByType(type); 
  }

  const typeStyles = {
    fire: styles.fire,
    water: styles.water,
    poison: styles.poison,
    grass: styles.grass,
    bug: styles.bug,
    ghost: styles.ghost,
    rock: styles.rock,
  };

  const habitatStyles = {
    cave: styles.cave,
    forest: styles.forest,
    grassland: styles.grassland,
    mountain: styles.mountain,
    rare: styles.rare,
    urban: styles.urban,
    sea: styles.sea,
  }

  return (
    <div>
      <div className={styles.galleryViewContainer}>
        <ul className={styles.filter}>
        {types.map((type, index) => (
            <div key={index} className={styles.filterGallery}>
              <li
                className={`${styles.filterCard} ${typeStyles[type] || styles.normal}`}
                key={`pokemon-${index}`}
                onClick={() => handlePokemonTypes(type)}
              >
                {type}
              </li>
            </div>
          ))}
          {habitats.map((habitat, index) => (
            <div key={index} className={styles.filterGallery}>
              <li 
              className={`${styles.filterCard} ${habitatStyles[habitat]}`} 
              key={`pokemom-${index}`} 
              onClick={() => handleHabitatClick(habitat)}>{habitat}</li>
            </div>
          ))
          }
        </ul>
      </div>
      {!noDataToDisplay ? (
        <div className={styles.galleryViewContainer}>
          <ul className={styles.gallery}>
            {pokemonData.map((pokemon, index) => (
              <div key={index} className={styles.galleryItemWrapper}>
                <GalleryItem 
                  key={`pokemom-${index}`} 
                  name={pokemon.name} 
                  url={pokemon.url}
                  onClick={() => handleGalleryCardClick(pokemon.name)} />
              </div>
            ))}
          </ul>
        </div>
      ) : (
        <div className={`${styles.pokemonCard} ${styles.nodataToDisplay}` }>
          <div>
            No Data to display
          </div>
        </div>
      )}
    </div>
   
  );
};

export default PokemonList;
