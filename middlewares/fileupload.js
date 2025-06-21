// const multer = require("multer")
// const { v4: uuidv4 } = require("uuid")

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => cb(null, "uploads/"),
//     filename: (req, file, cb) => {
//         const ext = file.originalname.split(".").pop()
//         const filename = `${file.fieldname}-${uuidv4()}.${ext}`
//         cb(null, filename)
//     }
// })
// const fileFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith("image")) cb(null, true)
//     else cb(new Error("Only image allowed"), false)
// }
// const upload = multer({
//     storage,
//     limits: { fileSize: 5 * 1024 * 1024 },// byte// optional
//     fileFilter // optional
// })

// module.exports = {
//     single: (fieldName) =>
//         upload.single(fieldName),
//     array: (fieldName, maxCount) =>
//         upload.array(
//             fieldName, maxCount
//         ),
//     fields: (fieldsArray) =>
//         upload.fields(fieldsArray)
// }

// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = Date.now() + "-" + file.originalname;
//     cb(null, uniqueName);
//   }
// });

// const upload = multer({ storage });

// module.exports = upload;


const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

// Ensure uploads folder exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // safer ext
    const uniqueName = `${file.fieldname}-${uuidv4()}${ext}`;
    cb(null, uniqueName);
  }
});

// Only accept images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Multer setup with limits & filter
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter,
});

// Export reusable middleware
module.exports = {
  single: (fieldName) => upload.single(fieldName),
  array: (fieldName, maxCount) => upload.array(fieldName, maxCount),
  fields: (fieldsArray) => upload.fields(fieldsArray),
};
