const mongoose = require('mongoose');
const {Schema} = mongoose;

const leaderboardSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    genre: String,
    hits: Number,
    total: Number,
    points: Number,
    maxcombo: Number,
    date: Date
})

mongoose.model('leaderboards', leaderboardSchema);