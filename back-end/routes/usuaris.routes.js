import express from 'express';
import { getAllUsuaris, getUsuariById, addUsuari, loginUsuari, registerUsuari } from '../controllers/usuaris.controller.js';
import { logRequestParams } from '../middlewares/params-middleware.js';
import { validateUser } from '../middlewares/validate-user.js';

export const usuarisRouter = express.Router();
usuarisRouter.get('/', getAllUsuaris);

usuarisRouter.get('/:id', logRequestParams, getUsuariById);

usuarisRouter.post('/', logRequestParams, validateUser, addUsuari);

// Auth routes
usuarisRouter.post('/login', loginUsuari);
usuarisRouter.post('/register', registerUsuari);