// server.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('pak army zindabad pak pak pakistani love Pakistan Pakistan zindabad≈'));
app.listen(port, () => console.log(`Listening on ${port}`));

