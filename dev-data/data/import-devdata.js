const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModle');

dotenv.config({ path: './../../config.env' });

const DB = 'mongodb+srv://vasanthakrishnan2213:WDIDqkXNAuerF9BJ@cluster0.4qi6azg.mongodb.net/natours?retryWrites=true&w=majority&appName=Cluster0'
// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD,
// );

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('connection was successfull');
  });

//Reading files
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'),
);

//Importing data to DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Successfull');
  } catch (err) {
    console.log(err);
  }
};

//Delete data from DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('delete Successfull');
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import'){
    importData()
}else if (process.argv[2] === '--delete') {
    deleteData()
}
