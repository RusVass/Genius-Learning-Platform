const { GridFSBucket, MongoClient } = require('mongodb');

const allowedImageMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
];

let mongoPromise;

function getConfig() {
  const maxFileSizeMb = Number(process.env.MAX_FILE_SIZE_MB ?? '5');
  const fileSizeLimit =
    Number.isFinite(maxFileSizeMb) && maxFileSizeMb > 0
      ? maxFileSizeMb * 1024 * 1024
      : 5 * 1024 * 1024;

  return {
    mongoUri: process.env.MONGODB_URI,
    mongoDbName: process.env.MONGODB_DB || 'files',
    gridFsBucket: process.env.GRIDFS_BUCKET || 'uploads',
    maxFileSizeMb,
    fileSizeLimit,
  };
}

async function getMongo() {
  if (mongoPromise) return mongoPromise;

  const { mongoUri, mongoDbName, gridFsBucket } = getConfig();
  if (!mongoUri) throw new Error('MONGODB_URI is not set');

  mongoPromise = (async () => {
    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db(mongoDbName);
    const bucket = new GridFSBucket(db, { bucketName: gridFsBucket });
    return { client, db, bucket };
  })();

  return mongoPromise;
}

module.exports = {
  allowedImageMimeTypes,
  getConfig,
  getMongo,
};

