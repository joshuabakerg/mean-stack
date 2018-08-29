var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

var ScriptSchema = new Schema({
    name: {type: String, required: true},
    type: {type: String, required: true},
    directory: {type: String, required: true},
    contents: {type: String, required: true},
    size: {type: Number, required: true},
    last_run: {type: Date},
    created: {type: Date, required: true},
    last_modified: {type: Date, default: Date.now},
    run_intervals: {type: Number, default: -1},
  },
  {collection: 'cronScript'}
);

module.exports = mongoose.model('cronScript', ScriptSchema);
