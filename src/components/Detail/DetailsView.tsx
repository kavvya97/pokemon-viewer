import React, { useState, useEffect } from 'react';
import styles from '../../Styles/Detail.module.scss';
import { Pokemon, PokemonDetails } from '../../common/constant';
import { pokemonDetailsCache } from '../ListView/ListItem';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
const DetailView: React.FC = () => {
    const { name } = useParams();
    const navigate = useNavigate();
    const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails | null>(null);
    const [pokemonNames, setPokemonNames] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [errorOccured, setErrorOccured] = useState(false);

    useEffect(() => {
        if (name && pokemonDetailsCache[name]) {
            setPokemonDetails(pokemonDetailsCache[name]);
            setPokemonNames(Object.keys(pokemonDetailsCache));
            setCurrentIndex(Object.keys(pokemonDetailsCache).indexOf(name));
        } else {
            axios.get(`https://pokeapi.co/api/v2/pokemon`)
                .then(response => {
                    const allNames = response.data.results.map((pokemon: Pokemon) => pokemon.name);
                    setPokemonNames(allNames);
                    setCurrentIndex(allNames.indexOf(name));
                    return axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
                })
                .then(response => {
                    if (name) {
                        const modifiedArr = response.data;
                        setPokemonDetails(modifiedArr);
                        pokemonDetailsCache[name] = response.data;
                        setErrorOccured(false);
                    }
                })
                .catch(error => {
                    setErrorOccured(true);
                    console.error("Error fetching Pokemon:", error);
                });
        }
    }, [name]);

    function shuffleArray(array: Pokemon[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      }

    const goToNext = () => {
        if (currentIndex < pokemonNames.length - 1) {
            const nextName = pokemonNames[currentIndex + 1];
            navigate(`/detail/${nextName}`);
        }
    };

    const goToPrevious = () => {
        if (currentIndex > 0) {
            const previousName = pokemonNames[currentIndex - 1];
            navigate(`/detail/${previousName}`);
        }
    };

    let cardClassName;
    let pokemonType = pokemonDetails?.types[0].type.name;
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
        <div>
         { !errorOccured ? (
            <div className={styles.detailContainer}>
                <button className={styles.prevButton} onClick={goToPrevious}>&lt;</button>
                
                <div className={`${styles.pokemonCard} ${cardClassName}`}>
                    <h1>{pokemonDetails?.name}</h1>
                    <div className="card-content">
                        <img 
                            src={pokemonDetails?.sprites.other.dream_world.front_default} 
                            alt={`Image of ${pokemonDetails?.name}`} 
                            className="card-image"
                        />
                        <ul className="abilities-list">
                            {pokemonDetails?.abilities.map((ability, index) => (
                                <li key={index}>{ability.ability.name}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <button className={styles.nextButton} onClick={goToNext}>&gt;</button>
            </div>
        ) : (
            <div className={`${styles.pokemonCard} ${styles.nodataToDisplay}` }>
                <div>
                No Data to display
                </div>
            </div>
            )}
        </div>
    )
}

export default DetailView;