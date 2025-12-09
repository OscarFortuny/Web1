import { getAllDBUniversitats, getDBUniversitatById, addDBUniversitat } from '../models/universitats.model.js';

export async function getAllUniversitats(req, res) {
    const universitats = await getAllDBUniversitats();
    res.json(universitats);
}

export async function getUniversitatById(req, res) {
    const universitatId = parseInt(req.params.id);
    const universitat = await getDBUniversitatById(universitatId); 
    res.json(universitat);
}

export async function addUniversitat(req, res) {
    const newUniversitat = req.body;

    if (!newUniversitat.name
        || newUniversitat.universitat_id === undefined 
        || !newUniversitat.country
        || !newUniversitat.city    
        || !newUniversitat.email) {
        return res.status(400).json({ error: 'Missing required universitat fields' });
    }

    const UniversitatExists = await getDBUniversitatById(newUniversitat.universitat_id);
    if (UniversitatExists) {
        return res.status(409).json({ error: 'Universitat with this universitat_id already exists' });
    }

    const addedUniversitat = await addDBUniversitat(newUniversitat);
    res.status(201).json(addedUniversitat);
}