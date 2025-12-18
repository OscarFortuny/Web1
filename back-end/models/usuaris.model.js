import { mondodbInstance } from '../infrastructure/mongodb-connextion.js';

const usuariMongooseSchema = new mondodbInstance.Schema({
	username: String,
	password: String,
	name: String,
	usuari_id: {
	type: Number,
	unique: true,
	index: true,
	},
	genere: String,
	language: String,
	destination_university: String,
	local_university: String,
	grup_id: {
		type: Number,
		ref: 'Grup',
		index: true
	}
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

export async function getDBUsuariByUsername(username) {
	const usuari = await UsuariMongooseModel.findOne({
		username: username
	});
	return usuari;
}

export async function getNextUsuariId() {
	const lastUsuari = await UsuariMongooseModel.findOne().sort({ usuari_id: -1 });
	return lastUsuari ? lastUsuari.usuari_id + 1 : 1;
}

export function addDBUsuari(usuari) {
	const newUsuari = new UsuariMongooseModel(usuari);
	return newUsuari.save();
}

export function updateDBUsuari(usuariId, updates) {
	return UsuariMongooseModel.findOneAndUpdate(
		{ usuari_id: usuariId },
		updates,
		{ new: true }
	);
}