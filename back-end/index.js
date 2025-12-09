import express from 'express';
import bodyParser from 'body-parser';
import { filmsRouter } from './routes/films.routes.js';
import { usuarisRouter } from './routes/usuaris.routes.js';
import cors from 'cors';
import { connectToDatabase } from './infrastructure/mongodb-connextion.js';


await connectToDatabase();

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/films', filmsRouter);
app.use('/usuaris', usuarisRouter);

app.listen(PORT,() => {
  console.log(`Server is running on port ${PORT}`);
});

