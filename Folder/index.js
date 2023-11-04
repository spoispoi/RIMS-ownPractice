const express = require('express');

const app = express();
const { readFile, readFileSync } = require('fs').promises;
//const express = require('express');
const db = require('./database.js');

//const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  console.log(db);

    db.all('SELECT * FROM Dish', [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});