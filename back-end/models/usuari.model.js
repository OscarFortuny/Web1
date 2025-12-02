import { mondodbInstance } from '../../infrastructure/mongodb-connextion.js';

const usuariMongooseSchema = new mondodbInstance.Schema({
	name: String,
	usuari_id: {
	type: Number,
	unique: true,
	index: true,
	},
	: String,
	director: String,
	producer: String,
	release_date: String,
});