import cloudinary from "cloudinary"

const instance = cloudinary.v2

instance.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export const upload = (fileName: string, folder: string): Promise<cloudinary.UploadApiResponse | undefined> => {
  return new Promise((resolve, reject) => {
    instance.uploader.upload(fileName, { unique_filename: true, folder }, (err, result) => {
      if (err) {
        reject(new Error(err.message))
      }
      resolve(result)
    })
  })
}