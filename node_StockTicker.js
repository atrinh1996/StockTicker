/*
 * node_StockTicker.js
 *
 * Author: Amy Bui
 * Comp20
 * Spring 2021
 */

const MongoClient = require('mongodb').MongoClient;
const csvParser = require('csv-parser');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// connection string
const url = "mongodb+srv://amybui:dbUser2014@cluster0.u3iji.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// File with data to fill database with
const dataFile = "companies.csv";

/* main
 * 
 * main driver functions to open connection to mongo db
 * to start filling db.
 * 
 * Note: Database name is StockDB, and the collection we want is companies.
 */
function main() {
    MongoClient.connect(url, {useUnifiedTopology: true}, 
        (err, database) => {
        if (err) {
            console.log("Connection to Mongo err: " + err);
            return;
        }

        // get database and collection object
        var dbo = database.db("StockDB");
        var collection = dbo.collection('companies');

        // console.log("Success!! :)");

        /***** Display Entire Database using query *****/
        // theQuery = "";
        // // theQuery = {name:"Facebook"};    // not in db
        // collection.find(theQuery).toArray((err, items) => {
        //     if (err) {
        //         console.log("Query Error: " + err);
        //         database.close();
        //     } else {
        //         console.log("Items: ");
        //         for (i = 0; i < items.length; i++) {
        //             console.log(`${i}: ${items[i].name} has ticker ${items[i].ticker}`);
        //         }
        //         database.close();
        //     }
        // });

        /******** Display Database with stream ********/
        // var s = collection.find().stream();

        // console.log("before find");
        // s.on("data", function(item) {
        //     console.log(`Data: ${item.name}`);
        // });

        // s.on("end", function() {
        //     console.log("end of data");
        //     database.close();
        // });

        // console.log("after close");


        /***** Insert into Database *******/
        // var newData = {"name": "Facebook", "ticker": "FB"};
        // collection.insertOne(newData, (err, res) => {
        //     if (err) throw err;
        //     console.log("new doc inserted");
        //     database.close();
        // });

        /******** Delete Data from Database w/ query *******/
        // var theQuery = {name: "Facebook"};
        // collection.deleteMany(theQuery, (err, obj) => {
        //     if (err) throw err;
        //     console.log(`Document(s) deleted`);
        //     database.close();
        // });

        // readFileWithReadLine();

        // parseWithCSVParser(collection);
        // deleteAllData(collection, database);

        displayOneItem(collection, database, "Adidas");


        // database.close();
    });
}


/* readFileWithReadLine
 *
 * Uses readline module to read lines from companies.csv file.
 * Resource used: Lecture Example
 */
function readFileWithReadLine() {
    var myFile = readline.createInterface(
        {input: fs.createReadStream(dataFile)}
    );

    myFile.on('line', (line) => {
        console.log(`This line is: ${line}`);
    });
}

/* parseWithCSVParser
 *
 * Uses the csv-parser package to read from companies.csv file.
 * Resources used: https://dev.to/isalevine/parsing-csv-files-in-node-js-with-fs-createreadstream-and-csv-parser-koi
 */
function parseWithCSVParser(coll) {
    fs.createReadStream(path.join(__dirname, '', dataFile))
    
        .on('error', function() {
            // handle error
            console.log(`An error ocurred :(`);
        })

        .pipe(csvParser())
        .on('data', function(row) {
            // use row data
            // console.log(row)
            // console.log(`Object: ${row}`);
            // console.log(`Company called ${row.Company} has ticker code ${row["Ticker"]}.`);

            var newData = row;
            coll.insertOne(newData, (err, res) => {
                if (err) throw err;
                console.log("new doc inserted");
                // database.close();
            });
        })
        .on('end', function() {
            // handle end of csv
            console.log(`End of csv file.`);
        });

    // deleteAllData(coll);



}


/* deleteAllData
 * 
 * Removes all data in database to help with testing.
 */
function deleteAllData(coll, database) {
    var theQuery = {};
    coll.deleteMany(theQuery, (err, obj) => {
        if (err) throw err;
        console.log(`Document(s) deleted`);
        database.close();
    });
}

/* displayOneItem
 *
 * Displays information from database using a query. 
 */
function displayOneItem(collection, database, target) {
    var s = collection.find().stream();

    s.on("data", function(item) {
        if (item["Company"] == target)
            console.log(`Data: ${item.Company} and ${item.Ticker}`);
    })
    .on("end", function() {
        database.close();
    });
}


// Readling lines
// function read() {
//     var csvParser = require('csv-parser');
//     var readline = require('readline');
//     var fs = require('fs');

//     var companiesFile = readline.createInterface(
//         {
//             input: fs.createReadStream('companies.csv')
//         }
//     );

//     companiesFile.on()
// }





main();






///////////////////////////////////////
/*
 * StockTickerExecute.js
 * (Part 2.3)
 * 
 * Display's user's requested information.
 * 
 * Author: Amy Bui
 * Comp20
 * Spring 2021
 */

// var http = require('http');
// // var url = require('url');
// var path = require('path');
// var fs = require('fs');
// var qs = require('querystring');
// var bodyParser = require('body-parser');
// const MongoClient = require('mongodb').MongoClient;
// var express = require('express');

// // connection string
// const mongoUrl = "mongodb+srv://amybui:dbUser2014@cluster0.u3iji.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// var app = express();
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.resolve(__dirname, 'public')));

// // var dbConn = MongoClient.connect(mongoUrl, {useUnifiedTopology: true});

// // Homepage
// app.get('/', (req, res) => {
//     // Create file path for index.html
//     var filePath = path.join(
//         __dirname,
//         'public',
//         'index.html'
//     );
//     // console.log(filePath);

//     // Ensure correct content type is picked
//     var contentType = getContType(filePath);
//     // console.log(contentType);

//     fs.readFile(filePath, function(err, content) {
//         if (err) { 
//             display404Page(err, res);
//         }
//         else { displayCurrentContent(content, contentType, res); }
//     });

// });

// app.post('/', function (req, res) {
//     MongoClient.connect(mongoUrl, {useUnifiedTopology: true}, (err, database) => {
//             if (err) {
//                 console.log("Connection to Mongo err: " + err);
//                 return;
//             }

//             // get database and collection object
//             var dbo = database.db("StockDB");
//             var collection = dbo.collection('companies');

//             var target = req.body.user_input;
//             var type = req.body.input_type;

//             // create query
//             theQuery = "";
//             if (type == "company") {
//                 theQuery = {name: target};
//             } else if (type == "ticker") {
//                 theQuery = {ticker: target};
//             }

//             // Find db item(s)
//             collection.find(theQuery).toArray((err, items) => {
//                 if (err) {
//                     console.log("Query Error: " + err);
//                     database.close();
//                 } else {
//                     console.log("Items: ");
//                     for (i = 0; i < items.length; i++) {
//                         console.log(`${i}: ${items[i].name} has ticker ${items[i].ticker}`);
//                     }
//                     // database.close();


//                     console.log(items);
//                     // return items;
//                     // res.end();
//                 }
//             });
//     });
// });




// const port = process.env.PORT || 8080;
// app.listen(port || 8080, () => {
//     console.log(`Server running on port ${port}`);
// });





// // const server = http.createServer((req, res) => {
// //     // create filepath for any page
// //     var filePath = path.join(
// //         __dirname,
// //         'public',
// //         req.url === '/' ? 'index.html' : req.url
// //     );
// //     // console.log(filePath);

// //     // Ensure correct content type is picked
// //     var contentType = getContType(filePath);
// //     // console.log(contentType);

// //     if (req.url == '/result') {
// //         // console.log("Inside /result");
// //         var resultFile = path.join(
// //             __dirname,
// //             'public',
// //             'result.html'
// //         );

// //         contentType = getContType(resultFile);

// //         res.writeHead(200, {'Content-Type': 'text/html'}); 
// //         // res.write ("Process the POST request<br>"); 
// //         pdata = ""; 
// //         req.on('data', data => {
// //             pdata += data.toString();
// //             res.write(pdata);
// //         })
// //         .on('end', () => {
// //             pdata = qs.parse(pdata);
// //             res.write(`The query is a ${pdata['input_type']} and the user typed in ${pdata['user_input']}`);

// //             var type = pdata['input_type'];
// //             var target = pdata['user_input'];

// //             // var resultArr = findStockInfo(target, type);
// //             // console.log(resultArr);

// //             findStockInfo(target, type, res, resultFile);
// //             // res.end();
// //         });
// //     } 
// //     else { 
// //         fs.readFile(filePath, function(err, content) {
// //             if (err) { 
// //                 display404Page(err, res);
// //             }
// //             else { displayCurrentContent(content, contentType, res); }
// //         });
// //     }
// // });

// // // the port in a variable using environment variable;
// // const port = process.env.PORT || 8080;
// // server.listen(port, () => console.log(`Server running on port ${port}`));


// // function findStockInfo(target, type, res, resultFile) {
// //     MongoClient.connect(mongoUrl, {useUnifiedTopology: true}, (err, database) => {
// //         if (err) {
// //             console.log("Connection to Mongo err: " + err);
// //             return;
// //         }
    
// //         // get database and collection object
// //         var dbo = database.db("StockDB");
// //         var collection = dbo.collection('companies');

// //         // create query
// //         theQuery = "";
// //         if (type == "company") {
// //             theQuery = {name: target};
// //         } else if (type == "ticker") {
// //             theQuery = {ticker: target};
// //         }

// //         // Find db item(s)
// //         // collection.find(theQuery).toArray((err, items) => {
// //         //     if (err) {
// //         //         console.log("Query Error: " + err);
// //         //         database.close();
// //         //     } else {
// //         //         console.log("Items: ");
// //         //         for (i = 0; i < items.length; i++) {
// //         //             console.log(`${i}: ${items[i].name} has ticker ${items[i].ticker}`);
// //         //         }
// //         //         // database.close();


// //         //         // console.log(items);
// //         //         // return items;
// //         //         res.end();
// //         //     }
// //         // });

// //         var s = collection.find().stream();

// //         s.on("data", function(item) {
// //             if (item["name"] == target)
// //                 console.log(`Data: ${item.name} and ${item.ticker}`);
// //         })
// //         .on("end", function() {
// //             database.close();
// //             fs.readFile(resultFile, (err, content) => {
// //                 displayCurrentContent(content, "text/html", res);
// //             });
// //         });
// //     });
// // }

// // /* getContType
// //  * Returns the string for Content-Type given a files path.
// //  * Limited to the cases shown below. Default will be html.
// //  */
// // function getContType(filePath) {
// //     var ext = path.extname(filePath);
// //     switch(ext) {
// //         case '.html':
// //             return 'text/html';
// //         case '.js':
// //             return 'text/javascript';
// //         case '.css':
// //             return 'text/css';
// //         case '.json':
// //             return 'application/json';
// //         case '.png':
// //             return 'image/png';
// //         case '.jpg':
// //             return 'image/jpg';
// //         default:
// //             return 'text/html';
// //     }
// // }

// // /* display404Page
// //  * displays error page when user attempts to view non page on server
// //  */
// function display404Page(err, res) {
//     if (err.code == 'ENOENT') { 
//         // Display 404 page
//         fs.readFile(path.join(__dirname, 'public', '404.html'), 
//                 (err, content) => {
//                     res.writeHead(200, { 'Content-Type': 'text/html' });
//                     res.end(content, 'utf8');
//                 });
//     }
// }

// // /* displayCurrentContent
// //  * Takes the response from server and displays content.
// //  */
// function displayCurrentContent(content, contentType, res) {
//     res.writeHead(200, { 'Content-Type': contentType });
//     res.end(content, 'utf8');
// }