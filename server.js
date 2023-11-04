const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./RIMS copy.db');


//1. GET - Retrieve all items from the inventory table
app.get('/inventory', (req, res) => {
    const sql = "SELECT * FROM Inventory";
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
    const { ingredientID, quantityInStock, supplierOrderID, expirationDate } = req.body;
    const sql = `INSERT INTO Inventory (IngredientID, QuantityInStock, SupplierOrderID, ExpirationDate) 
                 VALUES (?, ?, ?, ?)`;
    db.run(sql, [ingredientID, quantityInStock, supplierOrderID, expirationDate], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ inventoryID: this.lastID });
    });
  });

  
  //3. PUT - Update an item in the inventory table by ID

  app.put('/inventory/:id', (req, res) => {
    const { id } = req.params;
    const { ingredientID, quantityInStock, supplierOrderID, expirationDate } = req.body;
    const sql = `UPDATE Inventory 
                 SET IngredientID = ?, QuantityInStock = ?, SupplierOrderID = ?, ExpirationDate = ? 
                 WHERE InventoryID = ?`;
    db.run(sql, [ingredientID, quantityInStock, supplierOrderID, expirationDate, id], function(err) {
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
  
  