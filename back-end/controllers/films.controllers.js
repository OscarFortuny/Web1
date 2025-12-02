import { getAllDBFilms, getDBFilmById, addDBFilm } from '../models/films.model.js';

export async function getAllFilms(req, res) {
    const films = await getAllDBFilms();
    res.json(films);
}

export async function getFilmById(req, res) {
    const filmId = parseInt(req.params.id);
    const film = await getDBFilmById(filmId); 
    res.json(film);
}

export async function addFilm(req, res) {
    const newFilm = req.body;

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
