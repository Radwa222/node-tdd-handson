const userService = require('./user.service');
exports.signUp = (req, res) => {
  userService
    .save(req.body)
    .then((user) => {
      return res
        .status(201)
        .send({ data: { message: 'user created successfully', user } });
    })
    .catch((e) => res.status(500).send(e));
};
