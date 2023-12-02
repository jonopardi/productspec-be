const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const formFieldsSchema = new Schema(
  {
    field: { type: String, required: true },
  },
  { timestamps: true }
);

const formFields = mongoose.model('formFields', formFieldsSchema);

module.exports = formFields;
