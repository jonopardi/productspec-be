const modelUser = require('../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.getAllUser = (req, res) => {
  modelUser
    .find({})
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
};

exports.registerUser = (req, res) => {
  modelUser
    .count({
      $or: [{ nip: req.body.nip }, { email: req.body.email }],
    })
    .then((cnt) => {
      if (cnt > 0) {
        // res.statusMessage = 'NIP atau email sudah terdaftar';
        res.status(400).send('NIP atau email sudah terdaftar');
        // .json({ success: false, message: 'NIP atau email sudah terdaftar' });
      } else {
        const newUser = new modelUser({
          nama: req.body.nama,
          nip: req.body.nip,
          email: req.body.email,
          role: req.body.role,
          password: bcrypt.hashSync(req.body.password, 10),
        });
        newUser.save(function (err) {
          if (err) res.send(err);
          else {
            const token = jwt.sign(
              { user_id: newUser._id, email: newUser.email },
              process.env.SECRET_KEY_CONFIG,
              {
                expiresIn: '90d',
              }
            );
            newUser.token = token;
            res.status(201).send({
              message: 'Berhasil daftar',
              user: newUser,
              token: token,
            });
          }
        });
      }
    })
    .catch((err) => res.send(err));
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send('All input is required');
    }
    // Validate if user exist in our database
    const user = await modelUser.findOne({ email });

    if (user && (await bcrypt.compareSync(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.SECRET_KEY_CONFIG,
        {
          expiresIn: '90d',
        }
      );

      // save user token
      user.token = token;

      // user
      res.status(200).json({ user, token });
    }
    res.status(400).send('Invalid Credentials');
  } catch (error) {}
};
