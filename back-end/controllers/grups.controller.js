import { getAllDBGrups, getDBGrupById, addDBGrup, updateDBGrup, deleteDBGrup } from '../models/grups.model.js';

export async function getAllGrups(req, res) {
    const grups = await getAllDBGrups();
    res.json(grups);
}

export async function getGrupById(req, res) {
    const grupId = parseInt(req.params.id);
    const grup = await getDBGrupById(grupId); 
    res.json(grup);
}

export async function addGrup(req, res) {
    const newGrup = req.body;
    if (!newGrup.title 
        || !newGrup.episode_id
        || !newGrup.opening_crawl
        || !newGrup.director    
        || !newGrup.release_date) {
        return res.status(400).json({ error: 'Missing required grup fields' });
    }

    const grupExists = await getDBGrupById(newGrup.episode_id);
    if (grupExists) {
        return res.status(409).json({ error: 'Grup with this episode_id already exists' });
    }

    const addedGrup = await addDBGrup(newGrup);
    res.status(201).json(addedGrup);
}

export async function updateGrup(req, res) {
    const grupId = parseInt(req.params.id);
    const updates = req.body;
    const updatedGrup = await updateDBGrup(grupId, updates);
    res.json(updatedGrup);
}

export async function deleteGrup(req, res) {
    const grupId = parseInt(req.params.id);
    await deleteDBGrup(grupId);
    res.status(204).send();
}