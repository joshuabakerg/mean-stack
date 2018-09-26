const fs = require("fs");
const admin = require("firebase-admin");
const uuidv4 = require('uuid/v4');

class UploadService {

  constructor(userService, imageCompressService) {
    this.bucket = admin.storage().bucket();
    this.userService = userService;
    this.imageCompressService = imageCompressService;
    this.USER_DIR = "user";
    this.PROFILE_PIC_NAME = "profilePic";
  }

  async uploadProfilePicture(userName, location, options = {}) {
    let uuid = uuidv4();

    let size = fs.statSync(location)["size"];
    if(size > 50000){
      console.log(`Compressing image file ${location}`);
      await this.imageCompressService.compressImage(location);
      let newSize = fs.statSync(location)["size"];
      console.log(`Before[${size}] After[${newSize}] for file ${location}`);
    }

    options = Object.assign({
      deleteAfter: false,
      type: 'image/png'
    }, options);
    let filename = `${this.USER_DIR}/${userName}/${this.PROFILE_PIC_NAME}`;
    let picUrl =await this.bucket.upload(location, {
      destination: filename,
      uploadType: "media",
      metadata: {
        contentType: `${options.type}`,
        metadata: {
          firebaseStorageDownloadTokens: uuid
        }
      }
    }).then(([file]) => {
      file.makePublic();
      if (options.deleteAfter) {
        fs.unlink(location);
      }
      return file.metadata.mediaLink;
    }).catch(e => {
      console.error(e.stack)
    });

    // let picUrl = `https://storage.googleapis.com/${this.bucket.name}/${filename}`;
    let updated = await this.userService.updateUserDisplayPicture(userName, picUrl);
    if (updated) {
      return picUrl;
    }
  }

}

module.exports = UploadService;
