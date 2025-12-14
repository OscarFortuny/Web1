import express from 'express';
import { getAllGrups, getGrupById, addGrup } from '../controllers/grups.controller.js';
import { logRequestParams } from '../middlewares/params-middleware.js';
import { validateUser } from '../middlewares/validate-user.js';

export const grupsRouter = express.Router();

grupsRouter.get('/', getAllGrups);

grupsRouter.get('/:id', logRequestParams, getGrupById);

grupsRouter.post('/', logRequestParams, validateUser, addGrup);
