import mongoose from "mongoose";

const connectDB = async () => {
    const MAX_RETRIES = 5;
    let retries = 0;

    while (retries < MAX_RETRIES) {
        try {
            const conn = await mongoose.connect(process.env.MONGO_URI);
            console.log(`MongoDB Connected: ${conn.connection.host}`);
            return;
        } catch (error) {
            retries++;
            console.error(
                `MongoDB connection attempt ${retries}/${MAX_RETRIES} failed: ${error.message}`
            );

            if (retries >= MAX_RETRIES) {
                console.error("Max retries reached. Exiting...");
                process.exit(1);
            }

            const delay = Math.min(1000 * 2 ** retries, 30000);
            console.log(`Retrying in ${delay / 1000}s...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
};

export default connectDB;
