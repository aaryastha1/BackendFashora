// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   phoneNumber : { type: String, required: true, unique:true},
//   password: { type: String, required: true },
//   role:{ type:String, default:"normal"},
//   filepath: { type: String }

  
// });

// module.exports = mongoose.model('User', userSchema);


const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "normal" },
  filepath: { type: String },

  // 🆕 Favorites field
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

module.exports = mongoose.model('User', userSchema);
