const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Customer = new Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  address: {
    type: String
  },
  phones: {
    type: Array
  },
  gender: {
    type: String
  },
  dob: {
    type: Date
  }
}, {
  collection: 'customers'
})

module.exports = mongoose.model('Customer', Customer)