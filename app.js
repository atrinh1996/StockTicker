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

const express = require('express');
const path = require("path");
const bodyParser = require('body-parser');
const mongo = require('mongodb');
// const { type } = require('os');

// connection string
const url = "mongodb+srv://amybui:dbUser2014@cluster0.u3iji.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

var dbConn = mongo.MongoClient.connect(url, {useUnifiedTopology: true});

// create an instance of express to use
var app = express();
app.use(express.static(path.resolve(__dirname, 'public')));

// app.use(bodyParser.urlencoded({extended: false}));
// app.use(express.json());

// Gets the relevant form data
app.post('/result', function(req, res) {
    var target = req.body.user_input;
    console.log(target);

    var type = req.body.input_type;
    console.log(type);

    res.send(`${target} and ${type}`);

    // findStockInfo(target, type);
});

// Find information in Database
function findStockInfo(target, type) {
    dbConn.then(function(db) {
        var dbo = db.db("StockDB");
        var collection = dbo.collection('companies');

        // create query
        theQuery = "";
        if (type == "company") {
            theQuery = {name: target};
        } else if (type == "ticker") {
            theQuery = {ticker: target};
        }

        collection.find(theQuery).toArray((err, items) => {
            if (err) {
                console.log("Query Error: " + err);
                database.close();
            } else {
                console.log("Items: ");
                for (i = 0; i < items.length; i++) {
                    console.log(`${i}: ${items[i].name} has ticker ${items[i].ticker}`);
                }
                database.close();
                res.send(`${target} and ${type}`);
            }
        });
    });
}

app.listen(process.env.PORT || 8080);

// function findStockInfo(target, type) {

//     MongoClient.connect(url, {useUnifiedTopology: true}, (err, database) => {
//         if (err) {
//             console.log("Connection to Mongo err: " + err);
//             return;
//         }
    
//         // get database and collection object
//         var dbo = database.db("StockDB");
//         var collection = dbo.collection('companies');

//         // create query
//         theQuery = "";
//         if (type == "company") {
//             theQuery = {name: target};
//         } else if (type == "ticker") {
//             theQuery = {ticker: target};
//         }

//         // Find db item(s)
//         collection.find(theQuery).toArray((err, items) => {
//             if (err) {
//                 console.log("Query Error: " + err);
//                 database.close();
//             } else {
//                 console.log("Items: ");
//                 for (i = 0; i < items.length; i++) {
//                     console.log(`${i}: ${items[i].name} has ticker ${items[i].ticker}`);
//                 }
//                 database.close();
//             }
//         });
//     });
// }