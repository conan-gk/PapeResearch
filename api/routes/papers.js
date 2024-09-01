const express = require('express');
const router = express.Router();
const Paper = require('../models/Paper');
const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');

// Routes used to fetch 1) list of papers 2) paper content, on the frontend

// Route to get all papers, sorted alphabetically by title
router.get('/', async (req, res) => {
    try {
        const papers = await Paper.find().sort({ title: 1 });
        console.log("Fetched papers:", papers);  // Check what is being fetched
        res.json(papers);
    } catch (err) {
        console.error("Error fetching papers:", err);
        res.status(500).json({ message: err.message });
    }
});


// Search papers based on title, authors, or journal
router.get('/search', async (req, res) => {
    const { query } = req.query; // Get the search query from request

    try {
        // Search for papers that match the title, authors, or journal
        const papers = await Paper.find({
            $or: [
                { title: { $regex: query, $options: 'i' } }, // Case-insensitive search
                { authors: { $regex: query, $options: 'i' } },
                { journal: { $regex: query, $options: 'i' } }
            ]
        });

        res.json(papers); // Send the matching papers as response
    } catch (err) {
        console.error("Error fetching search results:", err);
        res.status(500).json({ message: 'Error fetching search results' });
    }
});


// Route to get a specific paper by ID and modify the HTML content for HTML file to be served
router.get('/:id', async (req, res) => {
    try {
        console.log("route accessed");
        const paper = await Paper.findById(req.params.id);

        // Read the HTML file content
        const filePath = path.join(__dirname, '../papers', paper.htmlFilePath);
        fs.readFile(filePath, 'utf8', (err, htmlContent) => {
            if (err) {
                console.error("Error reading HTML file:", err);
                return res.status(500).json({ message: 'Unable to read HTML file' });
            }

            // Load HTML content into Cheerio
            const $ = cheerio.load(htmlContent);

            const toc = $('nav.paper__nav').html(); // Extract Table of Contents
            $('nav.paper__nav').remove();           // Remove ToC

            $('header.app__header').remove();                                           // Remove header
            $('.content.text-center').remove();                                         // Remove footer
            $('li.paper__meta-item a[href*="semanticscholar.org"]').parent().remove();  // Remove "View in Semantic Scholar" link
            $('a[href^="mailto:accessibility@semanticscholar.org"]').parent().remove(); // Remove "Report a problem with this paper" link
            $('div.app__signup-form').remove();                                         // Remove the signup form

            // Extract all figures: used for Figure Panel logic
            const figures = [];
            $('figure').each((i, elem) => {
                const figureId = $(elem).attr('id');
                const imgSrc = $(elem).find('img').attr('src');
                const imgAlt = $(elem).find('img').attr('alt');
                const figCaption = $(elem).find('figcaption').text();

                console.log('Extracted Figure:', { figureId, imgSrc, imgAlt, figCaption }); // Log the extracted image details

                figures.push({
                    id: figureId,
                    imgSrc: imgSrc,
                    imgAlt: imgAlt,
                    caption: figCaption
                });

                // Wrap the image in a div and hide it initially
                $(elem).find('img').wrap('<div class="hidden-image" style="display: none;"></div>');
                // Make figure captions clickable & add a data attribute for the figure ID
                $(elem).find('figcaption').attr('data-figure-id', figureId).addClass('clickable-caption');
            });

            // Adjust URLs for static directory
            const updatedContent = $.html().replace(
                /href="\/static\/([^"]+)"/g,
                'href="http://localhost:3001/static/$1"'
            );

            // Respond with the updated HTML content, ToC, and figures as JSON
            res.json({
                paperContent: updatedContent,
                tableOfContents: toc,
                figures: figures
            });
        });

    } catch (err) {
        console.error("Error fetching paper:", err);
        res.status(500).json({ message: 'Unable to serve HTML for path' });
    }
});

module.exports = router;
