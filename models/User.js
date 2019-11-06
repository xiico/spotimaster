const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    name: String,
    id: String,
    points: Number,
    date: Date,
    picture: String,
    country: String
})

mongoose.model('users', userSchema);