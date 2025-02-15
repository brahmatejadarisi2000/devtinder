// mongoose package for database
const mongoose = require("mongoose");
const connectDB = async () => {
    await mongoose.connect("mongodb+srv://brahmatejadarisi:Kingmaker%402025@namastenode.3wds1.mongodb.net/devTinder");
}

module.exports = connectDB;