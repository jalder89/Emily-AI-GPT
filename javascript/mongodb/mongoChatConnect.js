import mongoose from 'mongoose';

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@aiconversationcluster0.4tyg45o.mongodb.net/slack?retryWrites=true&w=majority`;

mongoose.connect(uri);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to MongoDB");
});

export default db;