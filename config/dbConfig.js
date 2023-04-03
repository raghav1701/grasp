require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connection.on(
    'error',
    console.error.bind(console, 'Connection Error:')
);

mongoose.connection.on('open', () => {
    console.log('Connected to DB!');
});

const config = () => {
    const db = mongoose.connect(
        `mongodb+srv://Sarthak:${process.env.DB_PASS}@cluster0.0l2ty.mongodb.net/myFirstDatabase?retryWrites=true&w=majority` //uri
    );
    return db;
};

module.exports = { config };
