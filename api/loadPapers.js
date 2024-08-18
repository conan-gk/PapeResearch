const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const cheerio = require('cheerio');
const Paper = require('./models/Paper');  


// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/mern-test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to DB");
    loadPapers();
}).catch(console.error);


// For loading content from htmls into DB (title, authors, year, journal, file)
async function loadPapers() {
    const papersDirectory = path.join(__dirname, '../api/papers');      // sets papersDirectory to api/papers directory.

    fs.readdir(papersDirectory, async (err, files) => {                 // lists all files within /api/papers directory (all the html files)
        if (err) {
            console.error("Could not list the directory.", err);
            return;
        }

        for (let file of files) {                                       // loop over each file in the directory of html papers
            const filePath = path.join(papersDirectory, file);          // construct full path to each individual file of papers and store in 'filepath'
            const htmlContent = fs.readFileSync(filePath, 'utf8');      // read contents of html file as a UTF-8 encoded string, store in 'htmlcontent'
            const $ = cheerio.load(htmlContent);                        // loads html content from 'htmlcontent' into Cheerio for HTML parsing 

            const title = $('h1.paper__title').text().trim(); // selects <h1> element with class 'paper__title' from HTML document and extracts it to obtain title of paper. trim() removes trailing whitespace from text.
            
            // Extract authors, journal, and year            
            const authors = [];
            let journal = "Unknown Journal";
            let year = 0;


            $('li.paper__meta-item').each((index, element) => {     // iterates over each <li> element with class 'paper__meta-item'
                const text = $(element).text().trim();              // extracts & trims text from each <li> item.

                // Check if the element contains an <a> tag, skip it if it does
                if ($(element).find('a').length > 0) {
                    return;
                }

                // Check if the text is a year (number). if it is, save this as the year.
                if (!isNaN(text) && parseInt(text).toString() === text) {
                    year = parseInt(text);
                }

                // Check if the text is wrapped in <i> tags (journal)
                else if ($(element).find('i').length > 0) {
                    journal = $(element).find('i').text().trim();
                }

                // Otherwise, it's an author, add it to the authors array. 
                else {
                    authors.push(text);
                }
            });


            const newPaper = new Paper({
                title: title,
                authors: authors,
                year: year,
                journal: journal,
                htmlFilePath: file // Store only the filename
            });

            try {
                await newPaper.save();
                console.log(`Saved document for ${title}`);
            } catch (saveErr) {
                console.error(`Error saving document for ${title}:`, saveErr);
            }
        }

        // Close the mongoose connection after processing all files
        try {
            await mongoose.connection.close();
            console.log("Mongoose connection closed after loading papers.");
        } catch (closeErr) {
            console.error("Error closing mongoose connection:", closeErr);
        }
    });
}