import { getAllDBGrups, getDBGrupById, addDBGrup, updateDBGrup, deleteDBGrup, getDBGrupsByUniversitat, getNextGrupId } from '../models/grups.model.js';
import { getDBUsuariById, updateDBUsuari } from '../models/usuaris.model.js';

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

        if (!newGrup.name || !newGrup.universitat_id) {
            return res.status(400).json({ error: 'Missing required grup fields: name, universitat_id' });
        }

        if (!creadorId) {
            return res.status(400).json({ error: 'Missing creador_id (creator user ID)' });
        }

        // Obtener próximo grup_id automáticamente
        const nextGrupId = await getNextGrupId();

        const grupConCreador = {
            name: newGrup.name,
            grup_id: nextGrupId,
            universitat_id: newGrup.universitat_id,
            description: newGrup.description || '',
            usuaris: [creadorId]
        };

        const addedGrup = await addDBGrup(grupConCreador);
        
        // Actualizar el grup_id del usuario creador
        await updateDBUsuari(creadorId, { grup_id: nextGrupId });
        
        res.status(201).json({ success: true, grup: addedGrup });
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ success: false, error: 'Error creating group' });
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

export async function leaveGrup(req, res) {
    try {
        const grupId = parseInt(req.params.id);
        const { usuari_id } = req.body;

        if (!usuari_id) {
            return res.status(400).json({ error: 'Missing usuari_id in request body' });
        }

        const grup = await getDBGrupById(grupId);
        if (!grup) {
            return res.status(404).json({ error: 'Group not found' });
        }

        // Verificar que el usuario está en el grupo (comparar como strings)
        const usuariIdStr = usuari_id.toString();
        const isInGroup = grup.usuaris.some(id => id.toString() === usuariIdStr);
        if (!isInGroup) {
            return res.status(400).json({ error: 'User is not a member of this group' });
        }

        // Remover usuario del array (comparar como strings)
        const updatedUsuaris = grup.usuaris.filter(id => id.toString() !== usuariIdStr);

        // Si el grupo queda vacío, eliminarlo
        if (updatedUsuaris.length === 0) {
            await deleteDBGrup(grupId);
            // Actualizar el grup_id del usuario a null
            await updateDBUsuari(usuari_id, { grup_id: null });
            return res.json({ success: true, message: 'You left the group. Group was deleted as it had no remaining members.' });
        }

        // Actualizar el grupo con la nueva lista de usuarios
        await updateDBGrup(grupId, { usuaris: updatedUsuaris });
        
        // Actualizar el grup_id del usuario a null
        await updateDBUsuari(usuari_id, { grup_id: null });

        res.json({ success: true, message: 'You have left the group successfully' });
    } catch (error) {
        console.error('Error leaving group:', error);
        res.status(500).json({ success: false, error: 'Error leaving group' });
    }
}

export async function joinGrup(req, res) {
    try {
        const grupId = parseInt(req.params.id);
        const { usuari_id } = req.body;

        if (!usuari_id) {
            return res.status(400).json({ error: 'Missing usuari_id in request body' });
        }

        const grup = await getDBGrupById(grupId);
        if (!grup) {
            return res.status(404).json({ error: 'Group not found' });
        }

        // Verificar que el usuario no está ya en el grupo
        const usuariIdStr = usuari_id.toString();
        const isInGroup = grup.usuaris.some(id => id.toString() === usuariIdStr);
        if (isInGroup) {
            return res.status(400).json({ error: 'User is already a member of this group' });
        }

        // Verificar que el grupo no está lleno
        if (grup.usuaris.length >= MAX_MEMBERS) {
            return res.status(400).json({ error: `Group is full. Maximum ${MAX_MEMBERS} members allowed.` });
        }

        // Verificar que el usuario existe y tiene la misma universidad de destino
        const usuario = await getDBUsuariById(usuari_id);
        if (!usuario) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (usuario.destination_university?.toString() !== grup.universitat_id?.toString()) {
            return res.status(400).json({ 
                error: 'Cannot join this group. Your destination university does not match the group university.' 
            });
        }

        // Verificar que el usuario no pertenece ya a otro grupo
        if (usuario.grup_id) {
            return res.status(400).json({ error: 'You already belong to a group. Leave your current group first.' });
        }

        // Añadir usuario al grupo
        const updatedUsuaris = [...grup.usuaris, usuari_id];
        await updateDBGrup(grupId, { usuaris: updatedUsuaris });

        // Actualizar el grup_id del usuario
        await updateDBUsuari(usuari_id, { grup_id: grupId });

        res.json({ success: true, message: 'You have joined the group successfully', grup_id: grupId });
    } catch (error) {
        console.error('Error joining group:', error);
        res.status(500).json({ success: false, error: 'Error joining group' });
    }
}