const mongoose = require('mongoose'),
 schema = mongoose.Schema;

let userSchema = new schema({
  userId: {
    type: String,
    unique: true
  },
  Name: {
    type: String,
    default: ''
  },
  authToken:{
      type:String,
      unique:true
  }


});

mongoose.model('User',userSchema)