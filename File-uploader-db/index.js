const http = require('http');
const fs = require('fs');
const { readFile, appendFile, writeFile, rename, unlink, open } = require('fs/promises');

const port = process.env.PORT ?? 3000;
let cachedHello = null;

async function preloadHello() {
  try {
    cachedHello = await readFile('testRead.txt');
    console.log(cachedHello.toString());
  } catch (error) {
    console.error('Failed to read testRead.txt on startup', error);
    cachedHello = null;
  }
}

async function appendToFile(fileName, data) {
  try {
    await appendFile(fileName, data, { flag: 'a' });
    console.log('Appended to file successfully');
  } catch (e) {
    console.error('Got an error while writing the file', e.message);
  }
}

async function writeToFile(fileName, data) {
  try {
    await writeFile(fileName, data);
    console.log(`File ${fileName} updated successfully`);
  } catch (e) {
    console.error('Got an error while writing the file', e.message);
  }
}

async function appendWithOpen(fileName, contentToAdd) {
  let fileHandle;
  try {
    fileHandle = await open(fileName, 'a');
    await fileHandle.write(contentToAdd);
    console.log(`Content added to the file: ${fileName}`);
  } catch (e) {
    console.error('Got an error while appending the file', e.message);
  } finally {
    if (fileHandle) {
      await fileHandle.close().catch((err) =>
        console.error('Error closing file', err.message),
      );
    }
  }
}

async function renameFile(oldName, newName) {
  try {
    await rename(oldName, newName);
    console.log(`File renamed: ${oldName} -> ${newName}`);
  } catch (e) {
    console.error('Got an error while renaming the file', e.message);
  }
}

async function deleteFile(fileName) {
  try {
    await unlink(fileName);
    console.log(`File removed: ${fileName}`);
  } catch (e) {
    console.error('Got an error while deleting the file', e.message);
  }
}

// preloadHello();
writeToFile('testupload.txt', 'Upload from Node server\n');
appendToFile('testupload.txt', 'Appended line from Node server\n');
appendWithOpen('newfile.txt', 'Some content\n');
renameFile('newfile.txt', 'renamed-file.txt');
deleteFile('renamed-file.txt');

http
  .createServer(async (req, res) => {
    try {
      const data = cachedHello ?? (await readFile('testRead.txt'));
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    } catch (error) {
      console.error('Error reading testRead.txt during request', error);
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('File read error');
    }
  })
  .listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
