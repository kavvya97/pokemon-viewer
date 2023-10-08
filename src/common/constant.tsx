export type Pokemon = {
    name: string;
    url: string;
};

export type PokemonSpecies = {
    id: number,
    name: string,
    pokemon_species: Pokemon[]
}

export type pokeType = {
    pokemon: Pokemon,
    slot: number
}
export type PokemonTypeFilter = {
    pokemon: pokeType[]
}

export type PokemonType = {
    type: {
        name: String,
        url: String
    }
}

export type PokemonAbility = {
    ability: {
        name: string
    },
    base_experience: number
}
export type PokemonDetails = {
    abilities: PokemonAbility[],
    forms: [],
    height: number,
    types: PokemonType[],
    name: String,
    sprites: {
        other: {
            dream_world: {
                front_default: string,
                front_female: string
            },
            'official-artwork': {
                front_default: string,
                front_shiny: string
            }
        }
    },
    weight: number
}