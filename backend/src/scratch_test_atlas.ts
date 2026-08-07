import mongoose from 'mongoose';

const pass1 = 'sb25102004';
const uriDirect = `mongodb://akazz33333_db_user:${encodeURIComponent(pass1)}@ac-6jm2krd-shard-00-00.3gnbcqu.mongodb.net:27017,ac-6jm2krd-shard-00-01.3gnbcqu.mongodb.net:27017,ac-6jm2krd-shard-00-02.3gnbcqu.mongodb.net:27017/sample_mflix?ssl=true&replicaSet=atlas-6jm2krd-shard-0&authSource=admin&retryWrites=true&w=majority`;

async function testConn() {
  console.log('Testing Atlas direct seedlist connection to sample_mflix...');
  try {
    await mongoose.connect(uriDirect, { serverSelectionTimeoutMS: 10000 });
    console.log('🎉 SUCCESS! CONNECTED TO MONGO DB ATLAS sample_mflix DATABASE!');
    if (mongoose.connection.db) {
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('Collections in sample_mflix:', collections.map(c => c.name));
      
      const moviesCount = await mongoose.connection.db.collection('movies').countDocuments();
      console.log(`🎬 Total Movies in sample_mflix.movies: ${moviesCount}`);
    }
    process.exit(0);
  } catch (err: any) {
    console.error('❌ Direct Connection failed:', err.message);
    process.exit(1);
  }
}

testConn();
