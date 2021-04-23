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