const express = require("express");
const cors = require("cors")
require("dotenv").config();

const PORT = process.env.PORT || 3000;

// Init Express
const app = express();

// Enable CORS
app.use(cors());

app.use("/api/search", require('./routes/searchResults.js'))

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
