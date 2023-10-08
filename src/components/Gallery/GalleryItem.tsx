import React, { useState, useEffect } from 'react';
import { Pokemon, PokemonDetails } from '../../common/constant';
import styles from '../../Styles/Gallery.module.scss';
import axios from 'axios';

const GalleryItem: React.FC<Pokemon & {onClick?: () => void}> = ({ name, url, onClick }) => {
    const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails | null>(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(url);
          setPokemonDetails(response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, [url]);

    const pokemonType = pokemonDetails?.types[0]?.type.name;
    let cardClassName;
    switch (pokemonType) {
      case 'fire':
        cardClassName = styles.fire; break;
      case 'grass':
        cardClassName = styles.grass; break;
      case 'poison':
        cardClassName = styles.poison; break;
      case 'water': 
        cardClassName = styles.water; break;
      case 'rock': 
      case 'ground':
        cardClassName = styles.rock; break;
      case 'ghost': 
      case 'dark':
        cardClassName = styles.ghost; break;
      default:
        cardClassName = styles.normal; break;
    }

    return (
      <li onClick={onClick}>
        <div className={`${styles.pokemonCard} ${cardClassName}`}>
          <h3>{name}</h3>
          {pokemonDetails && (
            <div>
              <img
                src={pokemonDetails.sprites.other.dream_world.front_default || pokemonDetails.sprites.other['official-artwork'].front_default}
                alt={pokemonDetails.sprites.other['official-artwork'].front_default}
              />
            </div>
          )}
        </div>
      </li>
    );
};

  
export default GalleryItem;


