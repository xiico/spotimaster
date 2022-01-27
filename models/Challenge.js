const mongoose = require('mongoose');
const {Schema} = mongoose;

const challengeSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    genre: String,
    defending: { type: Schema.Types.ObjectId, ref: 'Leaderboard' },
    challenger: [{ type: Schema.Types.ObjectId, ref: 'Leaderboard' }],
    winner: { type: Schema.Types.ObjectId, ref: 'User' },
    score: Number,
    date: Date,
})

mongoose.model('challenge', challengeSchema);