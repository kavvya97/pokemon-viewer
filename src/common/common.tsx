import { Pokemon } from './constant';
import styles from '../Styles/Gallery.module.scss'


export const shufflePokemon = (array: Pokemon[]) => {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export const typeStyles = {
  fire: styles.fire,
  water: styles.water,
  poison: styles.poison,
  grass: styles.grass,
  bug: styles.bug,
  ghost: styles.ghost,
  rock: styles.rock,
};

export const habitatStyles = {
  cave: styles.cave,
  forest: styles.forest,
  grassland: styles.grassland,
  mountain: styles.mountain,
  rare: styles.rare,
  urban: styles.urban,
  sea: styles.sea,
}