const { ObjectId } = require('mongodb');
const { allowedImageMimeTypes, getConfig, getMongo } = require('../config/db');

const { gridFsBucket, mongoDbName } = getConfig();

function toObjectId(value) {
  try {
    return new ObjectId(value);
  } catch {
    return null;
  }
}

function assertContentTypeAllowed(contentType) {
  if (contentType && !allowedImageMimeTypes.includes(contentType)) {
    const err = new Error('Unsupported media type');
    err.status = 415;
    throw err;
  }
}

async function uploadImage(file) {
  const { bucket } = await getMongo();
  const { originalname, mimetype, size, buffer } = file;
  const safeName = originalname ? `${Date.now()}_${originalname}` : `file_${Date.now()}`;

  const uploadStream = bucket.openUploadStream(safeName, { contentType: mimetype });
  uploadStream.end(buffer);

  await new Promise((resolve, reject) => {
    uploadStream.on('finish', resolve);
    uploadStream.on('error', reject);
  });

  const id = uploadStream.id ? uploadStream.id.toString() : null;
  if (!id) {
    const err = new Error('Upload failed');
    err.status = 500;
    throw err;
  }

  return {
    id,
    url: `/api/images/${id}`,
    originalname,
    mimetype,
    size,
    bucket: gridFsBucket,
    db: mongoDbName,
  };
}

async function listImages({ page = 1, limit = 20 } = {}) {
  const { db } = await getMongo();

  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const skip = (safePage - 1) * safeLimit;

  const imagesRegex = /\.(png|jpe?g|webp|gif|svg)$/i;
  const filter = { filename: { $regex: imagesRegex } };

  const filesCol = db.collection(`${gridFsBucket}.files`);
  const total = await filesCol.countDocuments(filter);
  const items = await filesCol
    .find(filter)
    .sort({ uploadDate: -1 })
    .skip(skip)
    .limit(safeLimit)
    .toArray();

  return {
    page: safePage,
    limit: safeLimit,
    total,
    pages: Math.ceil(total / safeLimit),
    items: items.map((f) => ({
      id: f._id.toString(),
      filename: f.filename,
      size: f.length,
      uploadDate: f.uploadDate,
      url: `/api/images/${f._id}`,
    })),
  };
}

async function getImageStream(idValue) {
  const { db, bucket } = await getMongo();
  const id = toObjectId(idValue);

  if (!id) {
    const err = new Error('Invalid id');
    err.status = 400;
    throw err;
  }

  const file = await db.collection(`${gridFsBucket}.files`).findOne({ _id: id });
  if (!file) {
    const err = new Error('Not found');
    err.status = 404;
    throw err;
  }

  assertContentTypeAllowed(file.contentType);

  const stream = bucket.openDownloadStream(id);
  return { file, stream };
}

async function deleteImageById(idValue) {
  const { db, bucket } = await getMongo();
  const id = toObjectId(idValue);

  if (!id) {
    const err = new Error('Invalid id');
    err.status = 400;
    throw err;
  }

  const file = await db.collection(`${gridFsBucket}.files`).findOne({ _id: id });
  if (!file) {
    const err = new Error('Not found');
    err.status = 404;
    throw err;
  }

  await bucket.delete(id);
  return { ok: true, id: idValue };
}

module.exports = {
  deleteImageById,
  getImageStream,
  listImages,
  uploadImage,
};

