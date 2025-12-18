import { mondodbInstance } from '../infrastructure/mongodb-connextion.js';

const grupsMongooseSchema = new mondodbInstance.Schema({
    name: {
        type: String,
        required: true
    },
    grup_id: {
        type: Number,
        unique: true,
        index: true,
        required: true
    },
    universitat_id: {
        type: String,
        required: true,
        index: true
    },
    usuaris: [{
        type: String,
        ref: 'Usuari'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
        default: ''
    }
});

const GrupsMongooseModel = mondodbInstance.model('Grup', grupsMongooseSchema);

export async function getAllDBGrups() {
    const grups = await GrupsMongooseModel.find().lean();
    return grups;
}

export async function getDBGrupById(id) {
    const grup = await GrupsMongooseModel.findOne({
        grup_id: id
    });
    return grup;
}

export function addDBGrup(grup) {
    const newGrup = new GrupsMongooseModel(grup);
    return newGrup.save();
}

export function updateDBGrup(id, updates) {
    return GrupsMongooseModel.findOneAndUpdate(
        { grup_id: id },
        updates,
        { new: true }
    );
}

export function deleteDBGrup(id) {
    return GrupsMongooseModel.findOneAndDelete({ grup_id: id });
}

export async function getDBGrupsByUniversitat(universitatId) {
    const grups = await GrupsMongooseModel.find({ universitat_id: universitatId }).lean();
    return grups;
}

export async function getNextGrupId() {
    const lastGrup = await GrupsMongooseModel.findOne().sort({ grup_id: -1 });
    return lastGrup ? lastGrup.grup_id + 1 : 1;
}