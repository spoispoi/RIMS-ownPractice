const express = require('express')
const app = express()

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./RIMS copy.db');


// This line helps parse JSON body data
app.use(express.json());

const { readFile, readFileSync } = require('fs').promises;
//const express = require('express');
//const app = express();
const PORT = 3000;

//1. GET - Retrieve all items from the inventory table
app.get('/inventory', (req, res) => {
    const sql = "SELECT * FROM Dish";
    db.all(sql, [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
  });
  

  //2. POST - Insert a new item into the inventory table
  app.post('/inventory', (req, res) => {
    const { InventoryID, IngredientID, QuantityInStock, SupplierOrderID, ExpirationDate } = req.body;
    const sql = `INSERT INTO Inventory (InventoryID, IngredientID, QuantityInStock, SupplierOrderID, ExpirationDate) 
                 VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [InventoryID, IngredientID, QuantityInStock, SupplierOrderID, ExpirationDate], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ InventoryID: this.lastID });
    });
  });

  
  //3. PUT - Update an item in the inventory table by ID

  app.put('/inventory/:id', (req, res) => {
    const {id} = req.params;
    const { InventoryID, IngredientID, QuantityInStock, SupplierOrderID, ExpirationDate } = req.body;
    const sql = `UPDATE Inventory 
                 SET InventoryID = ?, IngredientID = ?, QuantityInStock = ?, SupplierOrderID = ?, ExpirationDate = ? 
                 WHERE InventoryID = ?`;
    db.run(sql, [InventoryID, IngredientID, QuantityInStock, SupplierOrderID, ExpirationDate], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ message: "Inventory item not found" });
        return;
      }
      res.json({ message: "Inventory item updated successfully" });
    });
  });
  

  
  //4. DELETE - Delete an item from the inventory table by ID
  app.delete('/inventory/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM Inventory WHERE InventoryID = ?";
    db.run(sql, id, function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ message: "Inventory item not found" });
        return;
      }
      res.json({ message: "Inventory item deleted successfully" });
    });
  });
  
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


