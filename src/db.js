const mongoose = require('mongoose');

mongoose
  .connect(process.env.mongourl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to database'))
  .catch((error) => console.log(error));
