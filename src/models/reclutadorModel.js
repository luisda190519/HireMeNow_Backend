const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const reclutadorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  cellphone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  jobPublished: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobApplication',
      default: '',
    },
  ],
});

reclutadorSchema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

reclutadorSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const Reclutador = mongoose.model('Reclutador', reclutadorSchema);

module.exports = Reclutador;
