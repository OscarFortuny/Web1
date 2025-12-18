import express from 'express';
import { getAllGrups, getGrupById, addGrup, updateGrup, deleteGrup, getGrupsByUniversitat, leaveGrup, joinGrup } from '../controllers/grups.controller.js';
import { logRequestParams } from '../middlewares/params-middleware.js';
import { validateUser } from '../middlewares/validate-user.js';

export const grupsRouter = express.Router();

grupsRouter.get('/', getAllGrups);

grupsRouter.get('/:id', logRequestParams, getGrupById);

grupsRouter.post('/', logRequestParams, validateUser, addGrup);
grupsRouter.put('/:id', logRequestParams, validateUser, updateGrup);
grupsRouter.post('/:id/leave', logRequestParams, validateUser, leaveGrup);
grupsRouter.post('/:id/join', logRequestParams, validateUser, joinGrup);

grupsRouter.delete('/:id', logRequestParams, validateUser, deleteGrup);
grupsRouter.get('/universitat/:universitat_id', logRequestParams, getGrupsByUniversitat);