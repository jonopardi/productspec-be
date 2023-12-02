const modelFormFields = require('../models/formFields');

exports.getField = (req, res) => {
  modelFormFields.find().then((result) => {
    res.send(result);
  });
};

exports.addField = (req, res) => {
  const uploadField = new modelFormFields({
    field: req.body.field,
  });
  uploadField.save(function (err, result) {
    if (err) {
      responses = { error: true, message: 'Error adding data' };
    } else {
      responses = {
        error: false,
        message: 'Data added',
        uploadField,
      };
    }
    res.json(responses);
  });
};

exports.deleteField = (req, res) => {
  modelFormFields.findOneAndRemove({ _id: req.params._id }, (err) => {
    modelFormFields.find({}, function (err, doc) {
      res.send(doc);
      if (err) {
        res.send(err);
      }
    });
    if (err) {
      res.send(err);
    }
  });
};
