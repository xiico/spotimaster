const mongoose = require('mongoose');
const Leaderboard = mongoose.model('leaderboards');
const Challenge = mongoose.model('challenge');
const User = mongoose.model('users');

module.exports = (app) => {
    app.get(`/api/challenges/:id?`, async (req, res) => {
        // console.log('app.props:', app.props);
        // let result;
        let resultLead;
        let resultUser;
        console.log('req.params:',req.params);
        let query = {};
        if (req.params.id) query._id = req.params.id;
        try {
            let resultId = await getResult(query);
            console.log('results(ch):',resultId.length);
            // result = resultId;
            if (resultId.length === 0) {
                resultLead = await getResult({ defending:req.params.id });
                console.log('results(de):',resultLead.length);
                // result = resultLead;
                if (resultLead.length) return res.status(200).send(resultLead);
            } else return res.status(200).send(resultId);
            resultUser = await getResult({ user:req.params.id });
            console.log('results(us):',resultUser.length);
            return res.status(200).send(resultUser);
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }

        async function getResult(query) {
            result = await Challenge.find(query).populate({
                path: 'defending',
                select: { 'genre': 1, 'points': 1, 'user': 1, 'date': 1 },
                populate: { path: 'user', select: { 'name': 1, 'picture': 1, 'id': 1 }, model: User }, model: Leaderboard
            }).populate({
                path: 'challenger',
                select: { 'user': 1, 'points': 1 },
                populate: { path: 'user', select: { 'name': 1, 'picture': 1, 'id': 1 }, model: User }, model: Leaderboard
            }).sort({ date: -1 }).lean().limit(req.params.id ? 100 : 25);
            return result;
        }
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
    app.get(`/api/challengesranking`, async (req, res) => {
        console.log('/challenges/ranking');
        let result
        try {
            result = await Challenge.aggregate(getRanking());
            // console.log('challengesranking:',result);
            console.log('challengesranking:',result.length);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        return res.status(200).send(result);
        
    });
}

const getRanking = () => {
    return [
        {
          '$group': {
            '_id': '$winner', 
            'count': {
              '$sum': 1
            }
          }
        }, {
          '$match': {
            '_id': {
              '$ne': null
            }
          }
        }, {
          '$lookup': {
            'from': 'users', 
            'localField': '_id', 
            'foreignField': '_id', 
            'as': 'winner'
          }
        }, {
          '$project': {
            'count': 1, 
            'user': {
              '$arrayElemAt': [
                '$winner', 0
              ]
            }
          }
        }, {
          '$project': {
            '_id': '$user._id', 
            'name': '$user.name', 
            'id': '$user.id', 
            'picture': '$user.picture', 
            'country': '$user.country', 
            'href': '$user.href', 
            'count': '$count'
          }
        }, {
          '$sort': {
            'count': -1
          }
        }
      ];
}