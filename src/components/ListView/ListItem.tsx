import React, { useState, useEffect } from 'react';
import { Pokemon, PokemonDetails } from '../../common/constant';
import styles from '../../Styles/List.module.scss';
import axios from 'axios';
export const pokemonDetailsCache: Record<string, PokemonDetails> = {};
const ListItem: React.FC<Pokemon & {onClick?: () => void}> = ({ name, url , onClick }) => {
    const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails | null>(null);

    useEffect(() => {
      if (pokemonDetailsCache[name]) {
        setPokemonDetails(pokemonDetailsCache[name]);
      } else {
        const fetchData = async () => {
          try {
            const response = await axios.get(url);
            pokemonDetailsCache[name] = response.data;
            setPokemonDetails(response.data);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
        fetchData();
      }
    }, [name,url]);

    const pokemonType = pokemonDetails?.types[0]?.type.name;
    const abilities = pokemonDetails?.abilities;
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
          {pokemonDetails && (
            <div className={styles.cardContent}>
              <div className={styles.cardImage}>
                <img
                  src={pokemonDetails.sprites.other['official-artwork'].front_default}
                  alt={`Image of ${pokemonDetails.name}`}
                />
              </div>
              <div className={styles.cardInfo}>
                <h3>{name}</h3>
                <ul className={styles.cardDetails}>
                  <p><b>Height</b>: {pokemonDetails.height}</p>
                  <p><b>Weight</b>: {pokemonDetails.weight}</p>
                </ul>
              </div>
            </div>
          )}
        </div>
      </li>
    );
};

  
export default ListItem;


