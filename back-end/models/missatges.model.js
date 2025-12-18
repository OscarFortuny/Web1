import { mondodbInstance } from '../infrastructure/mongodb-connextion.js';

const missatgeMongooseSchema = new mondodbInstance.Schema({
    missatge_id: {
        type: Number,
        unique: true,
        index: true,
    },
    grup_id: {
        type: Number,
        required: true,
        index: true,
    },
    usuari_id: {
        type: Number,
        required: true,
    },
    usuari_name: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const MissatgeMongooseModel = mondodbInstance.model('Missatge', missatgeMongooseSchema);

// Obtenir tots els missatges d'un grup
export async function getDBMissatgesByGrup(grupId) {
    const missatges = await MissatgeMongooseModel.find({ grup_id: grupId })
        .sort({ timestamp: 1 })
        .lean();
    return missatges;
}

// Obtenir els últims N missatges d'un grup
export async function getDBLastMissatgesByGrup(grupId, limit = 50) {
    const missatges = await MissatgeMongooseModel.find({ grup_id: grupId })
        .sort({ timestamp: -1 })
        .limit(limit)
        .lean();
    return missatges.reverse();
}

// Afegir un nou missatge
export async function addDBMissatge(missatge) {
    // Generar un nou ID únic
    const lastMissatge = await MissatgeMongooseModel.findOne().sort({ missatge_id: -1 });
    const newId = lastMissatge ? lastMissatge.missatge_id + 1 : 1;
    
    const newMissatge = new MissatgeMongooseModel({
        ...missatge,
        missatge_id: newId,
        timestamp: new Date(),
    });
    
    await newMissatge.save();
    return newMissatge.toObject();
}

// Obtenir missatges nous des d'un timestamp
export async function getDBMissatgesSince(grupId, sinceTimestamp) {
    const missatges = await MissatgeMongooseModel.find({
        grup_id: grupId,
        timestamp: { $gt: new Date(sinceTimestamp) }
    })
        .sort({ timestamp: 1 })
        .lean();
    return missatges;
}

// Eliminar tots els missatges d'un grup (quan el grup s'elimina)
export async function deleteDBMissatgesByGrup(grupId) {
    await MissatgeMongooseModel.deleteMany({ grup_id: grupId });
}
