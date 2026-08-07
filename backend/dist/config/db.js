"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.isMongoDB = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const ATLAS_DEFAULT_URI = 'mongodb+srv://akazz33333_db_user:sb25102004@cluster0.3gnbcqu.mongodb.net/sample_mflix?retryWrites=true&w=majority&appName=Cluster0';
const isMongoDB = () => {
    return true;
};
exports.isMongoDB = isMongoDB;
const connectDB = async () => {
    try {
        let mongoUrl = process.env.DATABASE_URL || ATLAS_DEFAULT_URI;
        if (!mongoUrl || mongoUrl.includes('127.0.0.1') || mongoUrl.includes('localhost') || mongoUrl.includes('event_management_db')) {
            mongoUrl = ATLAS_DEFAULT_URI;
        }
        if (mongoose_1.default.connection.readyState === 1 || mongoose_1.default.connection.readyState === 2) {
            return;
        }
        await mongoose_1.default.connect(mongoUrl, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log(`🍃 Connected to MongoDB Atlas database: ${mongoose_1.default.connection.db?.databaseName}`);
    }
    catch (error) {
        console.warn('⚠️ Database connection warning on serverless invocation:', error);
    }
};
exports.connectDB = connectDB;
