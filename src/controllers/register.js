const modelUser = require('../models/users');
// const md5 = require('md5');

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
        res.send({ success: false, message: 'NIP atau email sudah terdaftar' });
      } else {
        const newUser = new modelUser({
          nama: req.body.nama,
          nip: req.body.nip,
          email: req.body.email,
          role: req.body.role,
          password: req.body.password,
        });
        newUser.save(function (err) {
          if (err) res.send(err);
          else res.status(201).send({ message: 'Berhasil Daftar', newUser });
        });
      }
    })
    .catch((err) => res.send(err));
};
