import mongoose from "mongoose";

type connectionObject = {
    isConnected?: number
};

const connection: connectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI || "", {})
        connection.isConnected = db.connections[0].readyState
    } catch {
        process.exit(1)
    }
}

export default  dbConnect 