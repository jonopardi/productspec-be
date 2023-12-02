require('dotenv').config();
const express = require('express');
const cors = require('cors');
const registerRoute = require('./src/routes/RegisterRoute.js');
const userRoute = require('./src/routes/UserRoute.js');
const loginRoute = require('./src/routes/LoginRoute.js');
const productRoute = require('./src/routes/ProductRoute.js');
const formFieldsRoute = require('./src/routes/formFieldsRoutes.js');
const app = express();
// dependency multer
const multer = require('multer');
// dependency path
const path = require('path');
const https = require('https');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const fs = require('fs');
const port = process.env.PORT || 7000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/user', userRoute);
app.use('/product', productRoute);
app.use('/form_field', formFieldsRoute);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(multer({ storage: storage, fileFilter: fileFilter }).single('img'));

app.listen(port, function () {
  console.log('listening on port 7000');
});
