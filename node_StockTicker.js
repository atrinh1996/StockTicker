const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://amybui:Mongo2014@cluster0.u3iji.mongodb.net/StockDB?retryWrites=true&w=majority";

function main() {
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, database) {
        if (err) {
            return console.log("Connection to Mongo err: " + err);
        }

        var dbo = database.db("StockDB");
        var collection = dbo.collection("companies");

        console.log("Success!! :)");

        // database.close();
    })

}


// Readling lines
function read() {
    var csvParser = require('csv-parser');
    var readline = require('readline');
    var fs = require('fs');

    var companiesFile = readline.createInterface(
        {
            input: fs.createReadStream('companies.csv')
        }
    );

    companiesFile.on()
}





main();