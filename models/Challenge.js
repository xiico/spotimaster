const mongoose = require('mongoose');
const {Schema} = mongoose;

const challengeSchema = new Schema({
    defending: { type: Schema.Types.ObjectId, ref: 'Leaderboard' },
    challenger: { type: Schema.Types.ObjectId, ref: 'Leaderboard' },
    winner: { type: Schema.Types.ObjectId, ref: 'Leaderboard' },
    score: Number,
    date: Date,
})

mongoose.model('challenge', challengeSchema);