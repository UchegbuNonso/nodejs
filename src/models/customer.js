const mongoose = require('mongoose');
const customerSchema = new mongoose.Schema({
      name: {
            type: String,
            required: true
      },
      industry: String,
      age: Number,
      status: String
})
module.exports = mongoose.model('client', customerSchema);