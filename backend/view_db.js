import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio_builder';

async function viewData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('--- Database Summary ---');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    for (const collection of collections) {
      const data = await db.collection(collection.name).find().toArray();
      console.log(`\n[ ${collection.name.toUpperCase()} ] (${data.length} records)`);
      if (data.length > 0) {
        data.forEach(item => {
          // Remove sensitive/bloated info for the summary
          const { password, __v, ...cleanData } = item;
          console.log(JSON.stringify(cleanData, null, 2));
        });
      }
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

viewData();
