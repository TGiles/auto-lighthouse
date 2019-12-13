const express = require('express');
const open = require('open');
const serveIndex = require('serve-index');

const app = express();
app.use(express.static('coverage'), serveIndex('coverage'));
app.listen(10001, () => console.log('listening on 10001'));
open('http://localhost:10001');