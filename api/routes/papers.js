// routes/papers.js
const express = require('express');
const router = express.Router();
const Paper = require('../models/Paper');
const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');


// Route to get all papers, sorted alphabetically by title
router.get('/', async (req, res) => {
    try {
        const papers = await Paper.find().sort({ title: 1 });
        console.log("Fetched papers:", papers);  // See what is being fetched
        res.json(papers);
    } catch (err) {
        console.error("Error fetching papers:", err);
        res.status(500).json({ message: err.message });
    }
});


// Route to get a specific paper by ID and serve the HTML file, dynamically modify the HTML content
router.get('/:id', async (req, res) => {
    try {
        console.log("route accessed");
        const paper = await Paper.findById(req.params.id);

        // Read the HTML file content
        const filePath = path.join(__dirname, '../papers', paper.htmlFilePath);
        fs.readFile(filePath, 'utf8', (err, htmlContent) => {

            // Load HTML content into Cheerio
            const $ = cheerio.load(htmlContent);

            // Extract the Table of Contents (ToC)
            const toc = $('nav.paper__nav').html();

            // Remove the ToC from the HTML content
            $('nav.paper__nav').remove();

            // Remove the header
            $('header.app__header').remove();

            // Remove the footer or specific content
            $('.content.text-center').remove();

            // Remove "View in Semantic Scholar" link
            $('li.paper__meta-item a[href*="semanticscholar.org"]').parent().remove();

            // Remove "Report a problem with this paper" link
            $('a[href^="mailto:accessibility@semanticscholar.org"]').parent().remove();

            // Remove the signup form
            $('div.app__signup-form').remove();

            // Adjust URLs in href attributes for static directory
            const updatedContent = $.html().replace(
                /href="\/static\/([^"]+)"/g,
                'href="http://localhost:3001/static/$1"'
            );

            // Respond with both the updated HTML content and the ToC as JSON
            res.json({
                paperContent: updatedContent,
                tableOfContents: toc
            });
        });

    } catch (err) {
        // error, route doesn't get accessed properly
        res.status(500).json({ message: 'unable to serve html for path' });
    }
});



//pre-html content modification route
// // Route to get a specific paper by ID and serve the HTML file
// router.get('/:id', async (req, res) => {
//     try {
//         console.log("route accessed");
//         const paper = await Paper.findById(req.params.id);
//         console.log(paper.htmlFilePath);
//         res.sendFile(path.join(__dirname, '../papers', paper.htmlFilePath));
//     } catch (err) {
//         // error, route doesn't get accessed properly
//         res.status(500).json({ message: 'unable to serve html for path' });
//     }
// });


module.exports = router;