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
    if (isConnected || mongoose_1.default.connection.readyState === 1) {
        isConnected = true;
        return;
    }
    try {
        let mongoUrl = process.env.DATABASE_URL || ATLAS_DEFAULT_URI;
        if (!mongoUrl || mongoUrl.includes('127.0.0.1') || mongoUrl.includes('localhost')) {
            mongoUrl = ATLAS_DEFAULT_URI;
        }
        await mongoose_1.default.connect(mongoUrl, {
            serverSelectionTimeoutMS: 4000,
            connectTimeoutMS: 4000,
            socketTimeoutMS: 5000,
            bufferCommands: false,
        });
        isConnected = true;
        console.log(`🍃 Connected to MongoDB Atlas database: ${mongoose_1.default.connection.db?.databaseName}`);
    }
    catch (error) {
        console.warn('⚠️ Database connection warning on serverless invocation:', error);
    }
};
exports.connectDB = connectDB;
