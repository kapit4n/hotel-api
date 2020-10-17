var express = require('express');
var router = express.Router();
var HttpStatus = require('http-status-codes');

router.param('booking_id', function (req, res, next, booking_id) {
  console.log('Performing validations on ' + booking_id);

  req.booking_id = decodeURI(booking_id).trim();

  console.log('validated ' + booking_id);

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


// get all bookings
router.get('/', function (req, res) {
  console.log(req.app.db);
  let db = req.app.db;
  db.all("select * from bookings", [], (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.status(200).json(rows)
  })
})

// get booking by id
router.get('/:booking_id', function (req, res) {
  let db = req.app.db;
  var booking_id = req.params.booking_id;
  db.all("select * from bookings where id = ?", [booking_id], (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.status(200).json(row)
  })
})

// Create new booking
router.post('/', function (req, res) {
  let db = req.app.db;
  db.run('insert into bookings (name) values (?)', [req.body.name], function (err, result) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.status(201).json({
      "employee_id": this.lastID
    })
  });
})

// Create new booking
router.patch('/', function (req, res) {
  let db = req.app.db;
  db.run('update bookings set name = ? where id = ?', [req.body.name, req.body.id],
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
router.delete('/:booking_id', function (req, res) {
  var booking_id = req.body.booking_id;
  let db = req.app.db;
  db.run(`delete from bookings where id = ?`, booking_id, function (err, result) {
    if (err) {
      res.status(400).json({ 'error': res.message });
      return;
    }
    res.status(200).json({ deletedID: result })
  })
})



// Makes these configurations available when imported
module.exports = router;