/*
 * StockTickerDisplay.js
 * (Part 2.1)
 * 
 * Displays Stock Ticker's main page and display's user's requested information.
 * 
 * Author: Amy Bui
 * Comp20
 * Spring 2021
 */

const http = require('http');
const path = require('path');
const fs = require('fs');

// Create the server and load specified page
const server = http.createServer((req, res) => {
    // console.log(req.url)

    // create filepath for any page
    var filePath = path.join(
        __dirname,
        'public',
        req.url === '/' ? 'index.html' : req.url
    );
    // console.log(filePath);

    // Ensure correct content type is picked
    var contentType = getContType(filePath);
    // console.log(contentType);

    // Read file and fill browser page for main page
    fs.readFile(filePath, (err, pageContent) => {
        // if (err) throw err;
        if (err) {
            if (err.code == 'ENOENT') { 
                // Display 404 page
                fs.readFile(path.join(__dirname, 'public', '404.html'), 
                        (err, content) => {
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            res.end(content, 'utf8');
                        });
            }
        } else {    // Display page
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(pageContent, 'utf8');
        }
    });
});

// the port in a variable using environment variable;
const port = process.env.PORT || 8080;
server.listen(port, () => console.log(`Server running on port ${port}`));

/* getContType
 * Returns the string for Content-Type given a files path.
 * Limited to the cases shown below. Default will be html.
 */
function getContType(filePath) {
    var ext = path.extname(filePath);
    switch(ext) {
        case '.html':
            return 'text/html';
        case '.js':
            return 'text/javascript';
        case '.css':
            return 'text/css';
        case '.json':
            return 'application/json';
        case '.png':
            return 'image/png';
        case '.jpg':
            return 'image/jpg';
        default:
            return 'text/html';
    }
}

