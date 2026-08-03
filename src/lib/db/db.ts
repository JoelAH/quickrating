import "server-only";
import mongoose from 'mongoose'

const MONGODB_URI = process.env.DB_URI
const dbObj: { conn: any } = { conn: null };

async function dbConnect() {
    if (!MONGODB_URI) {
        throw new Error(
            'Please define the MONGODB_URI environment variable.',
        )
    }
    if (dbObj.conn == null) {
        //console.log('db conn null');
        dbObj.conn = mongoose.connect(MONGODB_URI, {
          serverSelectionTimeoutMS: 5000,
        }).then(() => mongoose);
        await dbObj.conn;
        //console.log("connected to DB");
      }
      
      return dbObj;
}

export default dbConnect