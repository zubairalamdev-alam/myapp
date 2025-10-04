// server.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Hedssdsdsdllouuu from maaaayapp v12345'));
app.listen(port, () => console.log(`Listening on ${port}`));

