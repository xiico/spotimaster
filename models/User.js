const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    name: String,
    points: Number,
    date: Date
})

mongoose.model('users', userSchema);