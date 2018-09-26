/*const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');*/
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const uuidv4 = require('uuid/v4');

class ImageCompressionService {

  constructor() {

  }

  async compressImage(fileDir, options = {}) {
    /*const files = await imagemin([fileDir], path.dirname(fileDir), {
      plugins: [
        imageminJpegtran(),
        imageminPngquant({quality: '5'})
      ]
    });*/
    let dir = path.dirname(fileDir);
    let newFile = path.join(dir, "resizeSrc"+uuidv4());
    await new Promise(function(resolve, reject) {
      fs.copyFile(fileDir, newFile, (err)=> {
        if (err) reject(err);
        else resolve();
      });
    });
    console.log('Resizing image');
    let res = await sharp(newFile)
      .resize(45, 45)
      .toFile(fileDir);
    console.log(res);
  }

}

module.exports = ImageCompressionService;
