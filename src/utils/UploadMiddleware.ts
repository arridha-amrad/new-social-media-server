import multer from "multer"

const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    cb(null, './uploads/')
  },
  filename: function (_, file, cb) {
    cb(null, new Date().toISOString() + '-' + file.originalname)
  }
})


const fileFilter = (_: any, file: any, cb: any) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    //reject file
    cb({
      message: 'Unsupported file format'
    }, false)
  }
}

const uploadMiddleWare = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024
  },
  fileFilter: fileFilter
})

export default uploadMiddleWare