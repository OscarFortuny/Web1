import express from 'express';
import { getAllUniversitats, getUniversitatById, addUniversitat } from '../controllers/universitats.controller.js';
import { logRequestParams } from '../middlewares/params-middleware.js';
import { validateUser } from '../middlewares/validate-user.js';

export const universitatsRouter = express.Router();
universitatsRouter.get('/', getAllUniversitats);

universitatsRouter.get('/:id', logRequestParams, getUniversitatById);

universitatsRouter.post('/', logRequestParams, validateUser, addUniversitat);
