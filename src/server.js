require('dotenv').config(); 

const app = require("./app");
const { connectDB } = require("./data/connection");

const PORT = 8080;

connectDB().then(() => {
    app.listen(PORT, () =>
        console.log(`Server is running on http://localhost:${PORT}`)
    );
});