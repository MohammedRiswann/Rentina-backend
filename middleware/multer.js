const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
require("aws-sdk/lib/maintenance_mode_message").suppress = true;

const accessId = process.env.ACCESS_KEY_ID;
const secretKey = process.env.SECRET_ACCESS_KEY;
const awsRegion = process.env.AWS_REGION;

AWS.config.update({
  accessKeyId: accessId,
  secretAccessKey: secretKey,
  region: awsRegion,
});

const s3 = new AWS.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "rentina",
    metadata: function (request, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (request, file, cb) {
      cb(null, Date.now().toString() + "-" + file.originalname);
      console.log("sudais fu");
    },
  }),
});

module.exports = upload;
