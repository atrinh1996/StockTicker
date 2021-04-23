/*
 * StockTickerPopulate.js
 *
 * Uses information from companies.csv file to populate specified 
 * Mongo database. 
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

        parseWithCSVParser(collection, database);
        // deleteAllData(collection, database);


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
function parseWithCSVParser(coll, db) {
    var dataArr = [];
    fs.createReadStream(path.join(__dirname, '', dataFile))
    
        .on('error', function() {
            // handle error
            console.log(`An error ocurred :(`);
        })

        .pipe(csvParser())

        .on('data', function(row) {
            var newData = objectWithCustomKeys(row);
            coll.insertOne(newData, (err, res) => {
                if (err) throw err;
                // console.log('inserted new doc');
            });
        })

        .on('end', function() {
            // console.log(`End of csv file.`);
        });

}

/* objectWithCustomKeys
 *
 * Returns an object to be inserted to database with 
 * custom key fields. 
 */
function objectWithCustomKeys(rowObj) {
    return {"name":rowObj.Company, "ticker":rowObj.Ticker};
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


// async function closeDB(database) {
//     return await database.close();
// }

/**** main driver ****/
main();