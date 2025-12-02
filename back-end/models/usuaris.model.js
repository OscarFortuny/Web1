import { mondodbInstance } from '../infrastructure/mongodb-connextion.js';

const usuariMongooseSchema = new mondodbInstance.Schema({
	name: String,
	usuari_id: {
	type: Number,
	unique: true,
	index: true,
	},
	genere: String,
	language: String,
	destination: String,
	university: String,
});


const UsuariMongooseModel = mondodbInstance.model('Usuari', usuariMongooseSchema);

export async function getAllDBUsuaris() {
	const usuaris = await UsuariMongooseModel.find().lean();
	return usuaris;
}

export async function getDBUsuariById(id) {
	const usuari = await UsuariMongooseModel.findOne({
		usuari_id: id
	});
	return usuari;
}

export function addDBUsuari(usuari) {
	const newUsuari = new UsuariMongooseModel(usuari);
	return newUsuari.save();
}