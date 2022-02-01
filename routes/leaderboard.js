const mongoose = require('mongoose');
const Leaderboard = mongoose.model('leaderboards');
const Challenge = mongoose.model('challenge');
const User = mongoose.model('users');

module.exports = (app) => {
    app.get('/api/leaderboard/:genre?', async (req, res) => {
        console.log('/api/leaderboard/:genre?>params:', req.params);
        let result; 
        if (req.params.genre === 'Normal') result = await Leaderboard.aggregate(byUser());
        else result = await Leaderboard.aggregate(byGenre(req.params.genre));
        return res.status(200).send(result);
    });
    app.post(`/api/leaderboard/:id`, async (req, res) => {
        console.log('post leaderboard:', req.params, req.body);
        let score = req.body;
        let user = await User.findOne({id: req.params.id});
        score.user = user._id;
        let leaderboarEntry = await Leaderboard.create(score).catch(error => {
            return res.status(500).send(error);
        });
        let challenge = {
            defending: leaderboarEntry._id,
            score: leaderboarEntry.points,
            date: new Date(),
        }
        console.log('saving challenge');
        let result = await Challenge.create(challenge).catch(error => {
            return res.status(500).send(error);
        });
        try {
            if (req.query.challenge) {
                console.log('req.query.challenge:',req.query.challenge)
                let challenge = await Challenge.findById(req.query.challenge);
                challenge.challenger.push(leaderboarEntry._id);
                challenge.save();
            }            
        } catch (error) {
            console.log(error);
        }
        console.log('challenge saved');
        return res.status(200).send({});
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

// Export leaderboards
/*db.users.aggregate([
    {
        $unwind: '$scores'
    },
    {
        $project: {
            _id: 0,
            user: '$_id',
            genre: '$scores.mode',
            hits: '$scores.hits',
            total: '$scores.total',
            points: '$scores.points',
            maxcombo: '$scores.maxcombo',
            date: '$scores.date'
        }
    },
    {
        $sort: {
            points: -1
        }
    },
    {
        // $out: "leaderboards"
    }
])

// Get leaderboard by user
db.leaderboards.aggregate([
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
])

// Get leaderboard by genre
db.leaderboards.aggregate([
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
])*/