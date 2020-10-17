var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

app.use(cors());

var users = require('./routes/users.service');
var rooms = require('./routes/rooms.service');
var clients = require('./routes/clients.service');
var bookings = require('./routes/bookings.service');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/users', users);
app.use('/rooms', rooms);
app.use('/clients', clients);
app.use('/bookings', bookings);
app.set('port', process.env.PORT);

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
})

const db = new sqlite3.Database('./users.db', (err) => {

  if (err) {
    console.log("Error opening db");
  } else {

    if (process.env.CREATE_TABLES_DB) {
      db.run(`create table users(
        id INTEGER primary key autoincrement not null, 
        name nvarchar(50) not null)`, (err) => {
        if (err) {
          console.log("Table already exists");
        }
      });


      db.run(`create table rooms(
        id INTEGER primary key autoincrement not null, 
        name varchar(250) not null,
        img varchar(250) not null,
        description text
        )`, (err) => {
        if (err) {
          console.log("Table already exists");
        }

      });

      db.run(`create table clients(
        id INTEGER primary key autoincrement not null, 
        identifier varchar(250) not null,
        img varchar(250) not null,
        address text
        )`, (err) => {
        if (err) {
          console.log("Table already exists");
        }
      });

      db.run(`create table bookings(
        id INTEGER primary key autoincrement not null, 
        userId INTEGER not null,
        roomId INTEGER not null,
        startDate datetime,
        duration INTEGER,
        payed INTEGER,
        totalToPay INTEGER,
        foreign key (roomId) references rooms(id),
        foreign key (userId) references users(id)
        )`, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }

    if (process.env.INSERT_INITIAL_DATA) {
      let insert = 'insert into users (name) values (?)';
      db.run(insert, ["Luis Arce"], error => {
        console.log(error);
      });
      db.run(insert, ["Juan Arce"], error => {
        console.log(error);
      });
      insert = 'insert into rooms (name, img, description) values (?, ?, ?)';
      db.run(insert, ["Room1", 'img', 'description'], error => {
        console.log(error);
      });
      db.run(insert, ["Room2", 'img2', 'description2'], error => {
        console.log(error);
      });
      insert = 'insert into clients (identifier, img, address) values (?, ?, ?)';
      db.run(insert, ["client1", 'img', 'description'], error => {
        console.log(error);
      });
      db.run(insert, ["client2", 'img2', 'description2'], error => {
        console.log(error);
      });
      insert = 'insert into bookings (userId, roomId, startDate, duration, payed, totalToPay) values (?, ?, ?, ?, ?, ?)';
      db.run(insert, [1, 1, "10-10-10", 1, 100, 3000], error => {
        console.log(error);
      });
    }
  }
});

app.db = db;
