var mongoose = require("mongoose");
// Create the schema class using mongoose's schema method
var Schema = mongoose.Schema;

// Create the noteSchema with the schema object
var noteSchema = new Schema({
  // The headline is the article associated with the note
  articleIdColumn: {
       type: String
  },
  // date is just a string
  date: {
    type: Date,
    default: Date.now
  },
  // as is the noteText
  noteText: String
});

// Create the Note model using the noteSchema
var Note = mongoose.model("Note", noteSchema);

// Export the Note model
module.exports = Note;