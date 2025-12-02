import express from 'express';
import { getAllFilms, getFilmById, addFilm } from '../controllers/films.controllers.js';
import { logRequestParams } from '../middlewares/params-middleware.js';
import { validateUser } from '../middlewares/validate-user.js';

export const filmsRouter = express.Router();

filmsRouter.get('/', getAllFilms);

filmsRouter.get('/:id', logRequestParams, getFilmById);

filmsRouter.post('/', logRequestParams, validateUser, addFilm);
