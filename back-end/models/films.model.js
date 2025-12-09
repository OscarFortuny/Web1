import { mondodbInstance } from '../infrastructure/mongodb-connextion.js';

const filmMongooseSchema = new mondodbInstance.Schema({
	title: String,
	episode_id: {
	type: Number,
	unique: true,
	index: true,
	},
	opening_crawl: String,
	director: String,
	producer: String,
	release_date: String,
});

const FilmMongooseModel = mondodbInstance.model('Film', filmMongooseSchema);

export async function getAllDBFilms() {
	const films = await FilmMongooseModel.find().lean();
	return films;
}

export async function getDBFilmById(id) {
	const film = await FilmMongooseModel.findOne({
		episode_id: id
	});
	return film;
}

export function addDBFilm(film) {
    const newFilm = new FilmMongooseModel(film);
	return newFilm.save();
}
