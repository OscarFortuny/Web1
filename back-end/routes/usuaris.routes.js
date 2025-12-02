import express from 'express';
import { getAllUsuaris, getUsuariById, addUsuari } from '../controllers/usuaris.controller.js';
import { logRequestParams } from '../middlewares/params-middleware.js';
import { validateUser } from '../middlewares/validate-user.js';

export const usuarisRouter = express.Router();
usuarisRouter.get('/', getAllUsuaris);

usuarisRouter.get('/:id', logRequestParams, getUsuariById);

usuarisRouter.post('/', logRequestParams, validateUser, addUsuari);