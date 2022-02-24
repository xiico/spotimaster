const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    name: String,
    id: String,
    href: String,
    date: Date,
    picture: String,
    country: String,
    challengeScore: Number,
    sessionId: String,
    allowSaveTrack: Boolean,
})

mongoose.model('users', userSchema);