import { connect } from "http2";
import mongoose from "mongoose"
require('dotenv').config(); 
import dotenv from 'dotenv';


type ConnectionObject = {
    isConnected?: number
}


const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if(connection.isConnected) {
        console.log("Already connected to the database");
        return;
    }

    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/Feedback';

    if (!uri) {
        throw new Error('MongoDB URI is not defined');
    }

    try {
        const db = await mongoose.connect(uri)

        connection.isConnected = db.connections[0].readyState;
        console.log("DB connected successfully");
        
    } catch (error) {
        console.error("DB connection error:", error);
        process.exit(1);
    }
}

export default dbConnect