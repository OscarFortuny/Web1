import express from 'express';
import { getAllGrups, getGrupById, addGrup, updateGrup, deleteGrup, getGrupsByUniversitat } from '../controllers/grups.controller.js';
import { logRequestParams } from '../middlewares/params-middleware.js';
import { validateUser } from '../middlewares/validate-user.js';

export const grupsRouter = express.Router();

grupsRouter.get('/', getAllGrups);

grupsRouter.get('/:id', logRequestParams, getGrupById);

grupsRouter.post('/', logRequestParams, validateUser, addGrup);
grupsRouter.put('/:id', logRequestParams, validateUser, updateGrup);

grupsRouter.delete('/:id', logRequestParams, validateUser, deleteGrup);
grupsRouter.get('/universitat/:universitat_id', logRequestParams, getGrupsByUniversitat);