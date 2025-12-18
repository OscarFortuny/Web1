import { Router } from 'express';
import { getMissatgesByGrup, sendMissatge } from '../controllers/missatges.controller.js';
import { validateUser } from '../middlewares/validate-user.js';

export const missatgesRouter = Router();

// Obtenir missatges d'un grup
// GET /missatges/:grupId?limit=50&since=timestamp
missatgesRouter.get('/:grupId', validateUser, getMissatgesByGrup);

// Enviar un missatge a un grup
// POST /missatges/:grupId
missatgesRouter.post('/:grupId', validateUser, sendMissatge);
