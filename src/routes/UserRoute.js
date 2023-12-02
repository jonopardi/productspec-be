// Importing express module
const express = require('express');
const router = express.Router();
// Handling request using router
const userSchema = {
  id_pemesan: String,
  tanggal: String,
  jam_mulai: String,
  jam_selesai: String,
  keperluan: String,
};

router.get('/', (req, res, next) => {
  res.send('This is the user request');
});
// Importing the router
module.exports = router;
