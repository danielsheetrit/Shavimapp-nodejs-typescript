import multer from 'multer';

const upload = multer({
  limits: { fieldSize: 25 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png)$/)) {
      //   logger.debug('uploadFile 1');
      return cb(new Error('Error! Please change to another profile picture'));
    }
    // logger.debug('uploadFile 2');
    return cb(null, true);
  },
});

export { upload };
