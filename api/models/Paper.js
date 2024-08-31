const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Model: how database structure should be created

// Schema for papers
const PaperSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    authors: {
        type: [String],
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    journal: {
        type: String,
        required: false
    },
    htmlFilePath: {
        type: String,
        required: true
    }
});


const Paper = mongoose.model('Paper', PaperSchema);
module.exports = Paper;


// (e.g., title, authors, publication year)
// any data that you plan to display in the list of papers. Subjects? Date (Month Year)
// TLDR, 
// fields that will help users search and filter papers more effectively