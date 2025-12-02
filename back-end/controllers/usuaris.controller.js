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

    if (!newUsuari.name 
        || !newUsuari.usuari_id
        || !newUsuari.genere
        || !newUsuari.language    
        || !newUsuari.destination) {
        return res.status(400).json({ error: 'Missing required usuari fields' });
    }

    const usuariExists = await getDBUsuariById(newUsuari.usuari_id);
    if (usuariExists) {
        return res.status(409).json({ error: 'Usuari with this usuari_id already exists' });
    }

    const addedUsuari = await addDBUsuari(newUsuari);
    res.status(201).json(addedUsuari);
}

