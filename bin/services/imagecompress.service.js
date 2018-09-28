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

  async compressImageNoResize(fileDir, options = {}) {
    /*const files = await imagemin([fileDir], path.dirname(fileDir), {
      plugins: [
        imageminJpegtran(),
        imageminPngquant({quality: '5'})
      ]
    });*/
  }

  async compressImage(fileDir, options = {}) {
    options = Object.assign({
      width : 100,
      height: 100
    }, options);
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
      .resize(options.width, options.height)
      .toFile(fileDir);
    fs.unlink(newFile);
    console.log(res);
  }

}

module.exports = ImageCompressionService;
