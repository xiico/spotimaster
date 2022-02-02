const mongoose = require('mongoose');
const Leaderboard = mongoose.model('leaderboards');
const Challenge = mongoose.model('challenge');
const User = mongoose.model('users');

module.exports = (app) => {
    app.get(`/api/challenges/:id?`, async (req, res) => {
        // console.log('app.props:', app.props);
        let result;
        // console.log('req.params:',req.params);
        let query = {};
        if (req.params.id) query._id = req.params.id;
        try {
            result = await Challenge.find(query).populate({
                path: 'defending',
                select: { 'genre': 1,'points':1,'user':1,'date':1 },
                populate: { path: 'user', select: { 'name': 1, 'picture': 1, 'id': 1 }, model: User }, model: Leaderboard
            }).populate({
                path: 'challenger',
                select: { 'user':1 },
                populate: { path: 'user', select: { 'name': 1, 'picture': 1, 'id': 1 }, model: User }, model: Leaderboard
            }).sort({ date:-1 }).lean().limit(20);
            console.log('result: ', result.length);      
        } catch (error) {
            console.log(error);
        }

        return res.status(200).send(result);
    });
    app.get(`/api/challengeinfo/:id`, async (req, res) => {
        let result;
        let query = {};
        console.log('req.params.id:',req.params.id);
        if (req.params.id) query._id = req.params.id;
        try {
            result = await Challenge.findOne(query).populate({
                path: 'defending',
                select: { 'genre': 1,'points':1,'user':1,'date':1 },
                populate: { path: 'user', select: { 'name': 1, 'picture': 1, 'id': 1 }, model: User }, model: Leaderboard
            }).sort({ date:-1 });
            console.log('result: ', result);           
        } catch (error) {
            console.log(error);
        }
        if (result.defending.user) {
            result.defending.user.sessionId = req.params.id;
            result.defending.user.save(error => {
                if (error) res.status(500).send({ error: error });
                console.log('user saved');
            });
        }

        return res.status(200).send(result);
    });
    app.get(`/api/challengeoptions/:user/:index`, async (req, res) => {
        let result;
        let query = {};
        console.log('req.params.user:',req.params.user);
        try {
            let user = await User.findOne({ _id:req.params.user });                   
            result = await Challenge.findOne({ _id: user.sessionId }).populate({
                path: 'defending',
                select: { 'genre': 1,'points':1,'user':1,'date':1, 'options': 1, 'songs': 1 }, model: Leaderboard
            }).sort({ date:-1 });
            console.log('result:',result);
            return res.status(200).send({tracks: result.defending.options[req.params.index], song: result.defending.songs[req.params.index].id});
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    });
}

const byUser = () => {
    return [
        { $sort: { points: -1 } },
        {
            $group: {
                _id: '$user',
                points: { $first: '$points' },
                genre: { $first: '$genre' },
                hits: { $first: '$hits' },
                total: { $first: '$total' },
                maxcombo: { $first: '$maxcombo' },
                date: { $first: '$date' },
                user: { $first: '$user' },
            }
        },
        {
            $lookup:
            {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $project: {
                genre: 1,
                hits: 1,
                total: 1,
                points: 1,
                maxcombo: 1,
                date: 1,
                user: { "$arrayElemAt": ["$user", 0] }
            }
        },
        {
            $project: {
                name: '$user.name',
                id: '$user.id',
                picture: '$user.picture',
                country: '$user.country',
                href: '$user.href',
                score: {
                    genre: '$genre',
                    points: '$points',
                    hits: '$hits',
                    total: '$total',
                    maxcombo: '$maxcombo'
                }
            }
        },
        {
            $sort: { 'score.points': -1 }
        }
    ];
}

const byGenre = (genre) => {
    let result = [
        { $sort: { points: -1 } },
        {
            $group: {
                _id: '$genre',
                docs: { $push: '$$ROOT' }
            }
        },
        {
            $project: {
                scores: { $slice: ['$docs', 3] }
            }
        },
        {
            $unwind: '$scores'
        },
        {
            $lookup:
            {
                from: "users",
                localField: "scores.user",
                foreignField: "_id",
                as: "scores.user"
            }
        },
        {
            $project: {
                scores:
                {
                    hits: 1,
                    total: 1,
                    points: 1,
                    maxcombo: 1,
                    date: 1,
                    user: { $arrayElemAt: ["$scores.user", 0] }
                }
            }
        },
        {
            $project: {
                scores:
                {
                    hits: 1,
                    total: 1,
                    points: 1,
                    maxcombo: 1,
                    date: 1,
                    user: {
                        id: 1,
                        picture: 1,
                        country: 1,
                        name: 1,
                        href: 1
                    }
                }
            }
        },
        {
            $group: {
                _id: '$_id',
                scores: { $push: '$scores' }
            }
        }
    ];
    if (genre) result.unshift({ $match:{ genre:genre } });
    return result;
}