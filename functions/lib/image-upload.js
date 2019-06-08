"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const init_1 = require("./init");
const path = require('path');
const os = require('os');
const mkdirp = require('mkdirp-promise');
const spawn = require('child-process-promise').spawn;
const rimraf = require('rimraf');
const { Storage } = require('@google-cloud/storage');
const gcs = new Storage();
exports.resizeThumbnail = functions.storage.object()
    .onFinalize((object, context) => __awaiter(this, void 0, void 0, function* () {
    const fileFullPath = object.name || '', contentType = object.contentType || '', fileDir = path.dirname(fileFullPath), fileName = path.basename(fileFullPath), tempLocalDir = path.join(os.tmpdir(), fileDir);
    console.log('Thumbnail generation started: ', fileFullPath, fileDir, fileName);
    if (!contentType.startsWith('image/') || fileName.startsWith('thumb_')) {
        console.log('Exiting image processing.');
        return null;
    }
    // Download the original file uploaded by the user
    yield mkdirp(tempLocalDir);
    const bucket = gcs.bucket(object.bucket);
    const originalImageFile = bucket.file(fileFullPath);
    const tempLocalFile = path.join(os.tmpdir(), fileFullPath);
    console.log('Downloading image to: ', tempLocalFile);
    yield originalImageFile.download({ destination: tempLocalFile });
    // Generate a thumbnail using ImageMagick
    const outputFilePath = path.join(fileDir, 'thumb_' + fileName);
    const outputFile = path.join(os.tmpdir(), outputFilePath);
    console.log('Generating a thumbnail to:', outputFile);
    yield spawn('convert', [tempLocalFile, '-thumbnail', '510x287 >', outputFile], { capture: ['stdout', 'stderr'] });
    // Upload the Thumbnail to storage
    const metadata = {
        contentType: object.contentType,
        cacheControl: 'public,max-age=2592000, s-maxage=2592000'
    };
    console.log('Uploading the thumbnail to storage:', outputFile, outputFilePath);
    const uploadedFiles = yield bucket.upload(outputFile, { destination: outputFilePath, metadata });
    // delete local files to avoid filling up the file system over time
    rimraf.sync(tempLocalDir);
    yield originalImageFile.delete();
    // create link to uploaded file
    const thumbnail = uploadedFiles[0];
    const url = yield thumbnail.getSignedUrl({ action: 'read', expires: new Date(3000, 0, 1) });
    console.log('Generated signed url:', url);
    // save thumbnail link in database
    const frags = fileFullPath.split('/'), courseId = frags[1];
    console.log('saving url to database: ' + courseId);
    return init_1.db.doc(`courses/${courseId}`).update({ uploadedImageUrl: url });
}));
//# sourceMappingURL=image-upload.js.map