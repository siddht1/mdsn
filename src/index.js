const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for specific origin
app.use(cors({
//   origin: "https://example.com"
}));

// Parse request body and extended the size to 1mb

app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));

// all routes
app.use("*", (req, res) => {
let fdata={
  response:'relay message'
};
  res.send(fdata);
});

app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
});
