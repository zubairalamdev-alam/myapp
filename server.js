// server.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Hello from myapp v1'));
app.listen(port, () => console.log(`Listening on ${port}`));

