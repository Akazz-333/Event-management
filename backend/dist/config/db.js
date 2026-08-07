"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.isMongoDB = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const ATLAS_DEFAULT_URI = 'mongodb+srv://akazz33333_db_user:sb25102004@cluster0.3gnbcqu.mongodb.net/event_management_db?retryWrites=true&w=majority&appName=Cluster0';
let isConnected = false;
const isMongoDB = () => {
    return true;
};
exports.isMongoDB = isMongoDB;
const connectDB = async () => {
    if (isConnected && mongoose_1.default.connection.readyState === 1) {
        return;
    }
    try {
        let mongoUrl = ATLAS_DEFAULT_URI;
        if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('cluster0.3gnbcqu.mongodb.net')) {
            mongoUrl = process.env.DATABASE_URL;
        }
        await mongoose_1.default.connect(mongoUrl, {
            serverSelectionTimeoutMS: 8000,
            connectTimeoutMS: 8000,
        });
        isConnected = true;
        console.log(`🍃 Connected to MongoDB Atlas database: ${mongoose_1.default.connection.db?.databaseName}`);
    }
    catch (error) {
        console.warn('⚠️ Database connection warning on serverless invocation:', error);
    }
};
exports.connectDB = connectDB;
