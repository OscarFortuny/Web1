import { mondodbInstance } from '../infrastructure/mongodb-connextion.js';

const universitatMongooseSchema = new mondodbInstance.Schema({
    name: String,
    universitat_id: {
    type: Number,
    unique: true,
    index: true,
    },
    country: String,
    city: String,
    email: String,
});


const UniversitatMongooseModel = mondodbInstance.model('Universitat', universitatMongooseSchema);

export async function getAllDBUniversitats() {
    const universitats = await UniversitatMongooseModel.find().lean();
    return universitats;
}

export async function getDBUniversitatById(id) {
    const universitat = await UniversitatMongooseModel.findOne({
        universitat_id: id
    });
    return universitat;
}

export function addDBUniversitat(universitat) {
    const newUniversitat = new UniversitatMongooseModel(universitat);
    return newUniversitat.save();
}