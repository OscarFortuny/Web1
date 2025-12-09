import mongoose, { mongo } from 'mongoose';

export async function connectToDatabase() {
    await mongoose.connect('mongodb://localhost:20170/backend-exemple');
}

export const mondodbInstance = mongoose;
