import { getAllDBUsuaris, getDBUsuariById, getDBUsuariByUsername, getNextUsuariId, addDBUsuari } from '../models/usuaris.model.js';

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
        || !newUsuari.destination_university
        || !newUsuari.local_university) {
        return res.status(400).json({ error: 'Missing required usuari fields' });
    }

    const usuariExists = await getDBUsuariById(newUsuari.usuari_id);
    if (usuariExists) {
        return res.status(409).json({ error: 'Usuari with this usuari_id already exists' });
    }

    const addedUsuari = await addDBUsuari(newUsuari);
    res.status(201).json(addedUsuari);
}

export async function loginUsuari(req, res) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Usuario y contraseña son requeridos' });
        }

        const usuari = await getDBUsuariByUsername(username);
        
        if (!usuari) {
            return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
        }

        if (usuari.password !== password) {
            return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
        }

        // No devolver la contraseña
        const userResponse = {
            usuari_id: usuari.usuari_id,
            username: usuari.username,
            name: usuari.name,
            genere: usuari.genere,
            language: usuari.language,
            destination_university: usuari.destination_university,
            local_university: usuari.local_university,
            grup_id: usuari.grup_id
        };

        res.json({ success: true, user: userResponse });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
}

export async function registerUsuari(req, res) {
    try {
        const { username, password, name, genere, language, destination_university, local_university } = req.body;

        if (!username || !password || !name || !genere || !language || !destination_university || !local_university) {
            return res.status(400).json({ success: false, message: 'Todos los campos son requeridos' });
        }

        // Verificar si el username ya existe
        const existingUser = await getDBUsuariByUsername(username);
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'El nombre de usuario ya está en uso' });
        }

        // Obtener el siguiente usuari_id
        const nextId = await getNextUsuariId();

        const newUsuari = {
            usuari_id: nextId,
            username,
            password,
            name,
            genere,
            language,
            destination_university,
            local_university
        };

        const savedUsuari = await addDBUsuari(newUsuari);

        // No devolver la contraseña
        const userResponse = {
            usuari_id: savedUsuari.usuari_id,
            username: savedUsuari.username,
            name: savedUsuari.name,
            genere: savedUsuari.genere,
            language: savedUsuari.language,
            destination_university: savedUsuari.destination_university,
            local_university: savedUsuari.local_university
        };

        res.status(201).json({ success: true, user: userResponse });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
}

