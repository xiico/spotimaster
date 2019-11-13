const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    name: String,
    id: String,
    scores: [{
        mode: String,
        hits: Number,
        total: Number,
        points: Number,
        maxcombo: Number,
        date: Date
    }],
    href: String,
    date: Date,
    picture: String,
    country: String
})

mongoose.model('users', userSchema);