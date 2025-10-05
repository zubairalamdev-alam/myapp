// server.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Hedssdsdsdllouuu from maaaayapp v1234 Haiqa is mad and waniya is popi≈'));
app.listen(port, () => console.log(`Listening on ${port}`));

