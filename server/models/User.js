const mongoose = require("mongoose");

const UsererSchema = mongoose.Schema({
  firstName: {
    type: String,
    require: [true, "first name is required"],
  },
  lastName: {
    type: String,
    require: [true, "last name is required"],
  },
  email: {
    type: String,
    require: [true, "email is required"],
    unique: true,
  },
  password: {
    type: String,
    require: [true, "password is required"],
  },
});

module.exports = mongoose.model("User", UsererSchema);
