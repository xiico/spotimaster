const mongoose = require('mongoose');
const {Schema} = mongoose;

const leaderboardSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    genre: String,
    hits: Number,
    total: Number,
    points: Number,
    maxcombo: Number,
    date: Date,
    songs: [
        {
            id: String,
            track: String,
            artist: String,
            image: String,
            result: String,
            time: Number
        }
    ],
    options: [[String]],
    availableForChallenge: Boolean,
})

mongoose.model('leaderboards', leaderboardSchema);