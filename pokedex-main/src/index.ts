import express, { Request, Response } from "express";
import path from "path";

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "/views"));

app.get('/', async (req: Request, res: Response) => {
    try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
        const data = await response.json();

        const pokemons = data.results.map((pokemon: any, index: number) => {
            const id = pokemon.url.split("/").filter(Boolean).pop();
            return { name: pokemon.name, id };
        });

        res.render("index", { pokemons });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao buscar os Pokémons.");
    }
});

app.get('/detalhar/pokemon/:id', async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await response.json();

        const pokemonDetails = {
            name: data.name,
            id: data.id,
            height: data.height,
            weight: data.weight,
            abilities: data.abilities.map((ab: any) => ab.ability.name),
            types: data.types.map((type: any) => type.type.name)
        };

        res.render("detalhar", { pokemon: pokemonDetails });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao buscar detalhes do Pokémon.");
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
