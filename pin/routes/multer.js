const multer  = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const uploadDir = './public/images/uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const unique = uuidv4();
    cb(null, unique + path.extname(file.originalname));
  }
});
  
  const upload = multer({ storage: storage })
  module.exports=upload;

// const multer = require('multer');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const cloudinary = require('./cloudinary');

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'uploads',
//     format: async (req, file) => 'jpg', // supports promises as well
//     public_id: (req, file) => file.filename,
//   },
// });

// const upload = multer({ storage: storage });

// module.exports = upload;
