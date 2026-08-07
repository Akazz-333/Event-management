"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const pass1 = 'sb25102004';
const uriDirect = `mongodb://akazz33333_db_user:${encodeURIComponent(pass1)}@ac-6jm2krd-shard-00-00.3gnbcqu.mongodb.net:27017,ac-6jm2krd-shard-00-01.3gnbcqu.mongodb.net:27017,ac-6jm2krd-shard-00-02.3gnbcqu.mongodb.net:27017/sample_mflix?ssl=true&replicaSet=atlas-6jm2krd-shard-0&authSource=admin&retryWrites=true&w=majority`;
async function testConn() {
    console.log('Testing Atlas direct seedlist connection to sample_mflix...');
    try {
        await mongoose_1.default.connect(uriDirect, { serverSelectionTimeoutMS: 10000 });
        console.log('🎉 SUCCESS! CONNECTED TO MONGO DB ATLAS sample_mflix DATABASE!');
        if (mongoose_1.default.connection.db) {
            const collections = await mongoose_1.default.connection.db.listCollections().toArray();
            console.log('Collections in sample_mflix:', collections.map(c => c.name));
            const moviesCount = await mongoose_1.default.connection.db.collection('movies').countDocuments();
            console.log(`🎬 Total Movies in sample_mflix.movies: ${moviesCount}`);
        }
        process.exit(0);
    }
    catch (err) {
        console.error('❌ Direct Connection failed:', err.message);
        process.exit(1);
    }
}
testConn();
