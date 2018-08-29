var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

var ServerSchema = new Schema({
    name: {
      type: String,
      required: true
    }
  },
  {collection: 'serverDetails'}
);

module.exports = mongoose.model('serverDetails', ServerSchema);
