var express = require('express');
var router = express.Router();
var HttpStatus = require('http-status-codes');

router.param('room_id', function (req, res, next, room_id) {
  req.room_id = decodeURI(room_id).trim();
  next();
});

router.all('*', function (req, res, next) {
  var authorized = true;
  if (authorized === false) {
    res.status(HttpStatus.UNAUTHORIZED).send(HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED));
  }
  next();
});

// get all rooms
router.get('/', function (req, res) {
  console.log(req.app.db);
  let db = req.app.db;
  db.all("select * from rooms", [], (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.status(200).json(rows)
  })
})

// get room by id
router.get('/:room_id', function (req, res) {
  let db = req.app.db;
  var room_id = req.params.room_id;
  db.all("select * from rooms where id = ?", [room_id], (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.status(200).json(row)
  })
})

// Create new room
router.post('/', function (req, res) {
  let db = req.app.db;
  db.run('insert into rooms (name) values (?)', [req.body.name], function (err, result) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.status(201).json({
      "employee_id": this.lastID
    })
  });
})

// Create new room
router.patch('/', function (req, res) {
  let db = req.app.db;
  db.run('update rooms set name = ? where id = ?', [req.body.name, req.body.id],
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
router.delete('/:room_id', function (req, res) {
  var room_id = req.body.room_id;
  let db = req.app.db;
  db.run(`delete from rooms where id = ?`, room_id, function (err, result) {
    if (err) {
      res.status(400).json({ 'error': res.message });
      return;
    }
    res.status(200).json({ deletedID: result })
  })
});

// Makes these configurations available when imported
module.exports = router;