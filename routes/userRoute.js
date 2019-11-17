const mongoose = require('mongoose');
const User = mongoose.model('users');

module.exports = (app) => {

  app.get('/api/user', async (req, res) => {
    console.log('get_user:', req.query.id);
    if (req.query.id) {
      let user = await User.findOne({ id: req.query.id });
      return res.status(200).send(user);
    } else {
      // let users = await User.find();
      let users = await User.find({},{scores:{$slice:1}}).sort({'scores.0.points':-1});
      return res.status(200).send(users);
    }
  });

  // app.get(`/api/user`, async (req, res) => {
  //   let users = await User.find();
  //   return res.status(200).send(users);
  // });

  // app.post(`/api/user`, async (req, res) => {
  //   let user = await User.create(req.body);
  //   console.log(req.body);
  //   return res.status(201).send({
  //     error: false,
  //     user
  //   });
  // });

  app.put(`/api/user/:id`, async (req, res) => {
    console.log('params: ', req.params);
    const { id } = req.params;
    let user = await User.findOne({id:id});
    user.name = req.body.name;
    user.picure = req.body.picure;
    user.href = req.body.href;
    user.scores.push(req.body.score);
    user.scores.sort((a, b) => {
        if(!a || !b) return;
        return b.points - a.points;
      }
    );
    delete req.body.id;
    user.save(error => {
      if (error) res.status(500).send({ error: error });
      console.log('user saved');
      return res.status(202).send({
        error: false
      });
    })
  });

  // app.delete(`/api/user/:id`, async (req, res) => {
  //   const { id } = req.params;

  //   let user = await User.findByIdAndDelete(id);

  //   return res.status(202).send({
  //     error: false,
  //     user
  //   });
  // });
}