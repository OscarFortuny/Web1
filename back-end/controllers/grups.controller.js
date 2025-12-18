import { getAllDBGrups, getDBGrupById, addDBGrup, updateDBGrup, deleteDBGrup, getDBGrupsByUniversitat } from '../models/grups.model.js';
import { getDBUsuariById } from '../models/usuaris.model.js';

const MAX_MEMBERS = 4;

export async function getAllGrups(req, res) {
    try {
        const grups = await getAllDBGrups();
        res.json(grups);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching groups' });
    }
}

export async function getGrupById(req, res) {
    try {
        const grupId = parseInt(req.params.id);
        const grup = await getDBGrupById(grupId);
        if (!grup) {
            return res.status(404).json({ error: 'Group not found' });
        }
        res.json(grup);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching group' });
    }
}

export async function getGrupsByUniversitat(req, res) {
    try {
        const universitatId = req.params.universitat_id;
        const grups = await getDBGrupsByUniversitat(universitatId);
        res.json(grups);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching groups' });
    }
}

export async function addGrup(req, res) {
    try {
        const newGrup = req.body;
        const creadorId = newGrup.creador_id;

        if (!newGrup.name || !newGrup.grup_id || !newGrup.universitat_id) {
            return res.status(400).json({ error: 'Missing required grup fields: name, grup_id, universitat_id' });
        }

        if (!creadorId) {
            return res.status(400).json({ error: 'Missing creador_id (creator user ID)' });
        }

        const grupExists = await getDBGrupById(newGrup.grup_id);
        if (grupExists) {
            return res.status(409).json({ error: 'Group with this grup_id already exists' });
        }

        const grupConCreador = {
            ...newGrup,
            usuaris: [creadorId]
        };

        const addedGrup = await addDBGrup(grupConCreador);
        res.status(201).json(addedGrup);
    } catch (error) {
        res.status(500).json({ error: 'Error creating group' });
    }
}

export async function updateGrup(req, res) {
    try {
        const grupId = parseInt(req.params.id);
        const updates = req.body;

        const grup = await getDBGrupById(grupId);
        if (!grup) {
            return res.status(404).json({ error: 'Group not found' });
        }

        if (updates.usuaris) {
            // Validación 1: No más de 4 usuarios
            if (updates.usuaris.length > MAX_MEMBERS) {
                return res.status(400).json({ 
                    error: `Maximum ${MAX_MEMBERS} members allowed per group. Attempted: ${updates.usuaris.length}` 
                });
            }

            // Validación 2: Todos los usuarios deben tener la universidad destino = universitat_id del grupo
            for (const usuariId of updates.usuaris) {
                const usuario = await getDBUsuariById(usuariId);
                if (!usuario) {
                    return res.status(404).json({ error: `User ${usuariId} not found` });
                }
                if (parseInt(usuario.destination_university) !== parseInt(grup.universitat_id)) {
                    return res.status(400).json({ 
                        error: `User ${usuario.name} (ID: ${usuariId}) cannot join this group. Their destination university (${usuario.destination_university}) does not match the group's university (${grup.universitat_id})` 
                    });
                }
            }

            // Validación 3: Si el grupo queda sin usuarios, eliminarlo automáticamente
            if (updates.usuaris.length === 0) {
                await deleteDBGrup(grupId);
                return res.json({ message: 'Group deleted due to no remaining members' });
            }
        }

        const updatedGrup = await updateDBGrup(grupId, updates);
        res.json(updatedGrup);
    } catch (error) {
        res.status(500).json({ error: 'Error updating group' });
    }
}

export async function deleteGrup(req, res) {
    try {
        const grupId = parseInt(req.params.id);
        const deletedGrup = await deleteDBGrup(grupId);
        if (!deletedGrup) {
            return res.status(404).json({ error: 'Group not found' });
        }
        res.json({ message: 'Group deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting group' });
    }
}