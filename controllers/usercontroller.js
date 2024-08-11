const fs = require('fs');
const multer = require('multer');
const User = require('./../models/userModle');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Factory = require('./handleFactory');
const sharp = require('sharp');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image. please upload only images', 400), false);
  }
};

const uplaod = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if(!req.file) return next()

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpg`

   await sharp(req.file.buffer).resize(500, 500).toFormat('jpeg').jpeg({ quality:90 }).toFile(`public/img/users/${req.file.filename}`)
    next()
})

exports.updateUserPhoto = uplaod.single('photo');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};
exports.getallUsers = Factory.getAll(User);

exports.updateMe = catchAsync(async (req, res, next) => {
  //1) send err if user posts password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for updating password. Please use /updateMyPassword',
        400,
      ),
    );
  }

  //2) filtering the fields
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

  //3) update the user data
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.createNewUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined. please use /signup instead',
  });
};
exports.getSpecificUser = Factory.getOne(User);
// Cannot update password withh this
exports.modifyUser = Factory.updateOne(User);
exports.deleteUser = Factory.deleteOne(User);
