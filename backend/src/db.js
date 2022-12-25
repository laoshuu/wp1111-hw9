import mongoose from 'mongoose';
import dotenv from 'dotenv-defaults';

const db = mongoose.connection;
db.on("error", (err) => console.log(err));

export default {
    connect: () => {
        dotenv.config();
        mongoose
            .connect(process.env.MONGO_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .then((res) => console.log("mongo db connection created"));
    }
};