const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send(`
    <html>
      <head>
        <title>HIDB Back</title>
      </head>
      <body style="font-family: sans-serif; text-align: center; margin-top: 50px;">
        <h1>Welcome to HIDB Back</h1>
      </body>
    </html>
  `);
});

module.exports = router;
