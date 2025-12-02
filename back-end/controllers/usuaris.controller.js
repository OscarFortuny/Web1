import { getAllDBUsuaris, getDBUsuariById, addDBUsuari  } from '../models/usuaris.model.js';

export async function getAllUsuaris(req, res) {
    const usuaris = await getAllDBUsuaris();
    res.json(usuaris);
}

export async function getUsuariById(req, res) {
    const usuariID = parseInt(req.params.id);
    const usuari = await getDBUsuariById(usuariID); 
    res.json(usuari);
}

export async function addUsuari(req, res) {
    const newUsuari = req.body;

    if (!newFilm.title 
        || !newFilm.episode_id
        || !newFilm.opening_crawl
        || !newFilm.director    
        || !newFilm.release_date) {
        return res.status(400).json({ error: 'Missing required film fields' });
    }

    const filmExists = await getDBFilmById(newFilm.episode_id);
    if (filmExists) {
        return res.status(409).json({ error: 'Film with this episode_id already exists' });
    }

    const addedFilm = await addDBFilm(newFilm);
    res.status(201).json(addedFilm);
}

