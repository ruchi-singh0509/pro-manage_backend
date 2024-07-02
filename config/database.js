const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose
            .connect(process.env.MONGODB_URI)
            .then(() => console.log('MongoDB Connected Successfully'));
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;