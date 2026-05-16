import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✔ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`✘ Primary database connection error: ${error.message}`);
    
    // Fallback to local MongoDB if primary fails (good for local dev)
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔄 Attempting fallback to local MongoDB (localhost:27017)...');
      try {
        const localConn = await mongoose.connect('mongodb://localhost:27017/portfolio_builder');
        console.log(`✔ Local MongoDB Connected: ${localConn.connection.host}`);
      } catch (localError) {
        console.error(`✘ Local fallback also failed: ${localError.message}`);
        console.log('⚠️ Server will continue running, but database features will be unavailable.');
      }
    } else {
      process.exit(1);
    }
  }
};

export default connectDB;