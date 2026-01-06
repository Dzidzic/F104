const { MongoClient } = require("mongodb");

const URI = process.env.MONGO_URI;
const client = new MongoClient(URI);

let db;

async function connectDB() {
    try {
        await client.connect();
        db = client.db("ditred");
        console.log("Połączono z bazą: \"ditred\"");
    } catch (error) {
        console.log("Błąd podczas próby połączenia z bazą MongoDB: " + error);
    }
}

function getDB() {
    if (!db) throw new Error("Baza danych nie jest połączona!");
    return db;
}

module.exports = { connectDB, getDB };
