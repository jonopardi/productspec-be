// Importing express module
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const auth = require('../middlewares/auth');
const productsController = require('../controllers/products');
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY_CLOUDINARY,
  api_secret: process.env.API_SECRET_CLOUDINARY,
});

router.get('/', auth, productsController.getAllProducts);
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

const uploadImg = multer({ storage: storage, fileFilter: fileFilter }).array(
  'img'
);

router.post('/', productsController.uploadProduct);
router.put('/imgProduct/:_id', uploadImg, productsController.uploadProductImg);
router.put('/deleteProductImg/:_id', productsController.deleteProductImg);
router.get('/:_id', productsController.getOneProduct);
router.delete('/:_id', productsController.deleteOneProduct);
router.put('/:_id', productsController.updateOneProduct);
router.post('/imgDelCloudinary', productsController.deleteOneImgFromCloudinary);
router.post('/oneImgUpload', uploadImg, productsController.uploadOneImg);
router.put('/updateOneImg/:_id', productsController.editOneImg);
// Importing the router
module.exports = router;
