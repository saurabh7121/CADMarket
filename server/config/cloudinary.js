const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Image storage (thumbnails & previews)
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'cadmarket/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  },
});

// CAD file storage (raw files — not publicly accessible via direct URL)
const cadStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'cadmarket/cad-files',
    resource_type: 'raw',
    allowed_formats: ['zip', 'rar', '7z', 'step', 'stl', 'stp'],
    type: 'private',  // Private so direct URL access is blocked
  },
});

const uploadImages = multer({
  storage: imageStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per image
});

const uploadCad = multer({
  storage: cadStorage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
});

// Middleware to handle product upload (thumbnail + previews + cad file)
const uploadProductFiles = (req, res, next) => {
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 500 * 1024 * 1024 },
  }).fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'previewImages', maxCount: 5 },
    { name: 'cadFile', maxCount: 1 },
  ]);

  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });

    try {
      // Upload thumbnail
      if (req.files?.thumbnail?.[0]) {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: 'cadmarket/images', resource_type: 'image', quality: 'auto' },
            (err, res) => err ? reject(err) : resolve(res)
          ).end(req.files.thumbnail[0].buffer);
        });
        req.uploadedThumbnail = { url: result.secure_url, publicId: result.public_id };
      }

      // Upload preview images
      if (req.files?.previewImages?.length) {
        const previews = await Promise.all(
          req.files.previewImages.map(file =>
            new Promise((resolve, reject) => {
              cloudinary.uploader.upload_stream(
                { folder: 'cadmarket/images', resource_type: 'image', quality: 'auto' },
                (err, res) => err ? reject(err) : resolve(res)
              ).end(file.buffer);
            })
          )
        );
        req.uploadedPreviews = previews.map(r => ({ url: r.secure_url, publicId: r.public_id }));
      }

      // Upload CAD zip (private)
      if (req.files?.cadFile?.[0]) {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: 'cadmarket/cad-files', resource_type: 'raw', type: 'private' },
            (err, res) => err ? reject(err) : resolve(res)
          ).end(req.files.cadFile[0].buffer);
        });
        req.uploadedCad = { url: result.secure_url, publicId: result.public_id };
      }

      next();
    } catch (uploadErr) {
      console.error('Upload error:', uploadErr);
      res.status(500).json({ message: 'File upload failed' });
    }
  });
};

module.exports = { cloudinary, uploadProductFiles };
