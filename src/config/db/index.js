const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/cgv_website';

// Use connect method to connect to the Server
async function connect() {
    try {
        await mongoose.connect(url);
        console.log('success !!!!');
    } catch (error) {
        console.log('Error', error);
    }
}
module.exports = { connect: connect };