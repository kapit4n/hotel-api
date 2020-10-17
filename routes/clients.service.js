var express = require('express');
var router = express.Router();
var HttpStatus = require('http-status-codes');

router.param('client_id', function (req, res, next, client_id) {
  console.log('Performing validations on ' + client_id);

  req.client_id = decodeURI(client_id).trim();

  console.log('validated ' + client_id);

  next();
});

router.all('*', function (req, res, next) {
  console.log('Performing authorization');

  var authorized = true;

  if (authorized === false) {
    res.status(HttpStatus.UNAUTHORIZED).send(HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED));
  }
  next();
});


// get all clients
router.get('/', function (req, res) {
  console.log(req.app.db);
  let db = req.app.db;
  db.all("select * from clients", [], (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.status(200).json(rows)
  })
})

// get client by id
router.get('/:client_id', function (req, res) {
  let db = req.app.db;
  var client_id = req.params.client_id;
  db.all("select * from clients where id = ?", [client_id], (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.status(200).json(row)
  })
})

// Create new client
router.post('/', function (req, res) {
  let db = req.app.db;
  db.run('insert into clients (name) values (?)', [req.body.name], function (err, result) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.status(201).json({
      "employee_id": this.lastID
    })
  });
})

// Create new client
router.patch('/', function (req, res) {
  let db = req.app.db;
  db.run('update clients set name = ? where id = ?', [req.body.name, req.body.id],
    function (err, result) {
      if (err) {
        res.status(400).json({ "error": res.message })
        return;
      }
      res.status(200).json({ updatedID: this.changes })
    }
  );
});

// Your endpoints will be configured here
router.delete('/:client_id', function (req, res) {
  var client_id = req.body.client_id;
  let db = req.app.db;
  db.run(`delete from clients where id = ?`, client_id, function (err, result) {
    if (err) {
      res.status(400).json({ 'error': res.message });
      return;
    }
    res.status(200).json({ deletedID: result })
  })
})



// Makes these configurations available when imported
module.exports = router;