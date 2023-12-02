const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = new Schema(
  {
    nama_produk: { type: String, required: true },
    dimensi: String,
    daya: String,
    bahan: String,
    jenis_produk: String,
    fitur: String,
    img: Array,
    imgPublicID: Array,
  },
  { strict: false, timestamps: true }
  // { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
