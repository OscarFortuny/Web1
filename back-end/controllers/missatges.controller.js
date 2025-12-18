import { 
    getDBMissatgesByGrup, 
    getDBLastMissatgesByGrup, 
    addDBMissatge, 
    getDBMissatgesSince 
} from '../models/missatges.model.js';
import { getDBGrupById } from '../models/grups.model.js';

// Obtenir missatges d'un grup
export async function getMissatgesByGrup(req, res) {
    const { grupId } = req.params;
    const { limit, since } = req.query;
    
    try {
        // Verificar que el grup existeix
        const grup = await getDBGrupById(parseInt(grupId));
        if (!grup) {
            return res.status(404).json({ error: 'Grup no trobat' });
        }
        
        let missatges;
        if (since) {
            // Obtenir missatges nous des d'un timestamp
            missatges = await getDBMissatgesSince(parseInt(grupId), since);
        } else if (limit) {
            // Obtenir els últims N missatges
            missatges = await getDBLastMissatgesByGrup(parseInt(grupId), parseInt(limit));
        } else {
            // Obtenir tots els missatges (amb límit per defecte de 100)
            missatges = await getDBLastMissatgesByGrup(parseInt(grupId), 100);
        }
        
        res.json(missatges);
    } catch (error) {
        console.error('Error obtenint missatges:', error);
        res.status(500).json({ error: 'Error intern del servidor' });
    }
}

// Enviar un nou missatge
export async function sendMissatge(req, res) {
    const { grupId } = req.params;
    const { usuari_id, usuari_name, text } = req.body;
    
    try {
        // Validar camps obligatoris
        if (!usuari_id || !usuari_name || !text) {
            return res.status(400).json({ error: 'Falten camps obligatoris' });
        }
        
        if (!text.trim()) {
            return res.status(400).json({ error: 'El missatge no pot estar buit' });
        }
        
        // Verificar que el grup existeix
        const grup = await getDBGrupById(parseInt(grupId));
        if (!grup) {
            return res.status(404).json({ error: 'Grup no trobat' });
        }
        
        // Verificar que l'usuari pertany al grup
        const usuariIdStr = usuari_id.toString();
        if (!grup.usuaris.includes(usuariIdStr)) {
            return res.status(403).json({ error: 'No pertanys a aquest grup' });
        }
        
        // Crear el missatge
        const newMissatge = await addDBMissatge({
            grup_id: parseInt(grupId),
            usuari_id: parseInt(usuari_id),
            usuari_name: usuari_name,
            text: text.trim(),
        });
        
        res.status(201).json({
            success: true,
            missatge: newMissatge
        });
    } catch (error) {
        console.error('Error enviant missatge:', error);
        res.status(500).json({ error: 'Error intern del servidor' });
    }
}
