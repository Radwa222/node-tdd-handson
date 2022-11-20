const userService = require('./user.service');
const { validateRequest } = require('./user.validations');
exports.signUp = (req, res) => {
  console.log(typeof req.body.phone_number);

  const errors = validateRequest(req);
  if (errors) return res.status(400).send({ errors });
  userService
    .save(req.body)
    .then((user) => {
      return res
        .status(201)
        .send({ data: { message: 'user created successfully', user } });
    })
    .catch((e) => res.status(500).send(e));
};
