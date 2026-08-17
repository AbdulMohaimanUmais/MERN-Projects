const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

exports.uploadFile = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file provided' });

  const streamUpload = () => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto', folder: 'chatsphere' },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };

  try {
    const result = await streamUpload();
    res.json({ url: result.secure_url });
} catch (err) {
  console.error('Upload error:', err);
  res.status(500).json({ message: err.message });
}
};