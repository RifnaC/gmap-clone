import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './config/database.js'
import dotenv from 'dotenv';
import auth from './routes/auth.js'
import maps from './routes/maps.js'
dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

connectDB();

// Routes
app.use('/api/auth', auth);
app.use('/api/maps', maps);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
