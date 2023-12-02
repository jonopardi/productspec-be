const { response } = require('express');
const modelProduk = require('../models/products');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

exports.uploadProduct = (req, res, next) => {
  // console.log(req);
  if (req.file === undefined) {
    const tesObj = {};
    Object.entries(req.body).forEach(([key, value]) => {
      tesObj[key] = value;
    });
    // console.log(tesObj);
    const uploadProduct = new modelProduk(tesObj);
    uploadProduct.save(function (err, result) {
      if (err) {
        responses = { error: true, message: 'Error adding data' };
      } else {
        responses = {
          error: false,
          message: 'Data added',
          uploadProduct,
          id: result._id,
        };
      }
      res.json(responses);
    });
  } else {
    cloudinary.uploader
      .upload(req.file.path)
      .then((result) => {
        const uploadProduct = new modelProduk({
          nama_produk: req.body.nama_produk,
          dimensi: req.body.dimensi,
          bahan: req.body.bahan,
          jenis_produk: req.body.jenis_produk,
          fitur: req.body.fitur,
          daya: req.body.daya,
          img: result.url,
        });
        uploadProduct.save();
        res.status(201).send({
          message: 'success',
          status: '201',
          result,
          uploadProduct,
        });
      })
      .catch((error) => {
        res.status(500).send({
          message: 'failure',
          error,
        });
      });
  }
};

async function uploadToCloudinary(localFilePath) {
  // localFilePath: path of image which was just
  // uploaded to "uploads" folder

  var mainFolderName = 'main';
  // filePathOnCloudinary: path of image we want
  // to set when it is uploaded to cloudinary
  var filePathOnCloudinary = mainFolderName + '/' + localFilePath;

  return cloudinary.uploader
    .upload(localFilePath)
    .then((result) => {
      // Image has been successfully uploaded on
      // cloudinary So we dont need local image
      // file anymore
      // Remove file from local uploads folder
      fs.unlinkSync(localFilePath);

      return {
        message: 'Success',
        url: result.secure_url,
        public_id: result.public_id,
      };
    })
    .catch((error) => {
      // Remove file from local uploads folder
      fs.unlinkSync(localFilePath);
      return { message: 'Fail' };
    });
}

exports.uploadProductImg = async (req, res, next) => {
  var imageUrlList = [];
  var imagePublicIDList = [];
  for (var i = 0; i < req.files.length; i++) {
    var localFilePath = req.files[i].path;

    // Upload the local image to Cloudinary
    // and get image url as response
    var result = await uploadToCloudinary(localFilePath);
    imageUrlList.push(result.url);
    imagePublicIDList.push(result.public_id);
    console.log(result);
  }
  modelProduk.updateOne(
    { _id: req.params._id },
    {
      img: imageUrlList,
      imgPublicID: imagePublicIDList,
    },
    { useFindAndModify: true },
    (err) => {
      if (!err) {
        res.send({
          message: 'success',
          status: '201',
          img: imageUrlList,
          imgPublicID: imagePublicIDList,
        });
      } else {
        res.send(err);
      }
    }
  );
};

// exports.uploadProductImg = (req, res) => {
//   // console.log(req.file);
//   cloudinary.uploader
//     .upload(req.file.path)
//     .then((result) => {
//       modelProduk.updateOne(
//         { _id: req.params._id },
//         {
//           img: result.url,
//         },
//         { useFindAndModify: true },
//         (err) => {
//           if (!err) {
//             res.send({
//               message: 'success',
//               status: '201',
//             });
//           } else {
//             res.send(err);
//           }
//         }
//       );
//     })
//     .catch((error) => {
//       res.status(500).send({
//         message: 'failure',
//         error,
//       });
//     });
// };

exports.getAllProducts = (req, res) => {
  modelProduk
    .find({})
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
};

exports.getOneProduct = (req, res) => {
  modelProduk
    .findOne({ _id: req.params._id })
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
};

exports.updateOneProduct = (req, res) => {
  const tesObj1 = {};
  Object.entries(req.body).forEach(([key, value]) => {
    tesObj1[key] = value;
  });
  modelProduk.updateOne(
    { _id: req.params._id },
    tesObj1,
    { useFindAndModify: true },
    (err) => {
      if (!err) {
        res.send('Berhasil ubah data');
      } else {
        res.send(err);
      }
    }
  );
};

exports.deleteOneProduct = (req, res) => {
  modelProduk.deleteOne({ _id: req.params._id }, (err) => {
    if (!err) {
      res.send('Berhasil hapus data');
    } else {
      res.send(err);
    }
  });
};

exports.deleteProductImg = (req, res) => {
  modelProduk.updateOne(
    { _id: req.params._id },
    { img: req.body.img, imgPublicID: req.body.imgPublicID },
    { useFindAndModify: true },
    (err) => {
      if (!err) {
        res.send('Berhasil ubah gambar');
      } else {
        res.send(err);
      }
    }
  );
};

exports.deleteOneImgFromCloudinary = (req, res) => {
  console.log(req.body);
  // res.send(req.body);
  cloudinary.uploader.destroy(`${req.body.publicID}`).then((result) => {
    console.log(result);
    res.send(result);
  });
};

exports.uploadOneImg = async (req, res) => {
  try {
    var result = await uploadToCloudinary(req.files[0].path);
    // await cloudinary.uploader.destroy(`${req.body.publicID}`)
    res.send(result);
  } catch (error) {
    res.send(error);
  }
};

exports.editOneImg = (req, res) => {
  modelProduk.updateOne(
    { _id: req.params._id },
    {
      img: req.body.img,
      imgPublicID: req.body.imgPublicID,
    },
    { useFindAndModify: true },
    (err) => {
      if (!err) {
        res.send({
          message: 'success',
          status: '201',
          img: req.body.img,
          imgPublicID: req.body.imgPublicID,
        });
      } else {
        res.send(err);
      }
    }
  );
};
