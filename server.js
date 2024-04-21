const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

const mySQLConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "2389",
  database: "Hospital",
});

mySQLConnection.connect((err) => {
  if (!err) console.log("Database connection created successfully!");
  else console.log("Error connecting to the database: " + err.message);
});

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/addData", (req, res) => {
  const { table } = req.body;
  res.redirect(`/create_${table}`);
});

app.get("/create_staff", (req, res) => {
  res.render("choose_table");
});

app.get("/create_room", (req, res) => {
  res.render("create_room");
});

app.get("/create_janitor", (req, res) => {
  res.render("create_janitor");
});

app.post("/addJanitor", (req, res) => {
  const janitor = req.body;
  const sql =
    "INSERT INTO JANITOR (Janitor_ID, Experience, shift_schedule, last_name, first_name, hire_date, salary) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const values = [
    janitor.Janitor_ID,
    janitor.Experience,
    janitor.shift_schedule,
    janitor.last_name,
    janitor.first_name,
    janitor.hire_date,
    janitor.salary,
  ];
  mySQLConnection.query(sql, values, (err, result) => {
    if (!err) res.redirect("/display_tables");
    else
      res
        .status(500)
        .send(
          "Error inserting entry, make sure you are not using the same primary key and the data is is in the right format"
        );
  });
});

app.post("/addRoom", (req, res) => {
  const room = req.body;
  const sql =
    "INSERT INTO ROOM (room_number, bed_count, room_type, Janitor_ID) VALUES (?, ?, ?, ?)";
  const values = [
    room.room_number,
    room.bed_count,
    room.room_type,
    room.Janitor_ID,
  ];
  mySQLConnection.query(sql, values, (err, result) => {
    if (!err) res.redirect("/display_tables");
    else
      res
        .status(500)
        .send(
          "Error inserting entry, make sure you are not violating any constraints and the data is set correctly with an existing janitor id"
        );
  });
});

const { formatDate, formatDateForInput } = require("./utils");

app.get("/display_tables", (req, res) => {
  mySQLConnection.query(
    "SELECT * FROM janitor_view",
    (err1, janitorsFromView, fields1) => {
      if (err1) {
        res.status(500).send("Internal Server Error");
        return;
      }

      mySQLConnection.query(
        "SELECT * FROM JANITOR",
        (err2, janitorsFromTable, fields2) => {
          if (err2) {
            res.status(500).send("Internal Server Error");
            return;
          }

          mySQLConnection.query(
            "SELECT * FROM ROOM",
            (err3, rooms, fields3) => {
              if (err3) {
                res.status(500).send("Internal Server Error");
                return;
              }

              mySQLConnection.query(
                "SELECT * FROM janitor_schedule_view",
                (err4, janitorSchedules, fields4) => {
                  if (err4) {
                    res.status(500).send("Internal Server Error");
                    return;
                  }

                  res.render("display_tables", {
                    janitorsFromTable: janitorsFromTable,
                    janitorsFromView: janitorsFromView,
                    rooms: rooms,
                    janitorSchedules: janitorSchedules,
                    formatDate: formatDate,
                  });
                }
              );
            }
          );
        }
      );
    }
  );
});

app.get("/updateJanitor/:janitor_id", (req, res) => {
  const janitorId = req.params.janitor_id;
  mySQLConnection.query(
    "SELECT * FROM JANITOR WHERE janitor_ID = ?",
    [janitorId],
    (err, janitor, fields) => {
      if (!err) {
        res.render("update_janitor", {
          janitor: janitor[0],
          formatDateForInput: formatDateForInput,
        });
      } else {
        res.status(500).send("Internal Server Error");
      }
    }
  );
});

app.post("/updateJanitor/:janitor_id", (req, res) => {
  const janitorId = req.params.janitor_id;
  const janitor = req.body;
  const sql =
    "UPDATE JANITOR SET Experience = ?, shift_schedule = ?, last_name = ?, first_name = ?, hire_date = ?, salary = ? WHERE Janitor_ID = ?";
  const values = [
    janitor.Experience,
    janitor.shift_schedule,
    janitor.last_name,
    janitor.first_name,
    janitor.hire_date,
    janitor.salary,
    janitorId,
  ];
  mySQLConnection.query(sql, values, (err, result) => {
    if (!err) res.redirect("/display_tables");
    else res.status(500).send("Internal Server Error");
  });
});

app.post("/deleteJanitor/:janitor_id", (req, res) => {
  const janitorId = req.params.janitor_id;
  const sql = "DELETE FROM JANITOR WHERE Janitor_ID = ?";
  mySQLConnection.query(sql, [janitorId], (err, result) => {
    if (!err) {
      res.redirect("/display_tables");
    } else {
      res.status(500).send("Internal Server Error");
    }
  });
});

app.get("/updateRoom/:room_number", (req, res) => {
  const roomNumber = req.params.room_number;
  mySQLConnection.query(
    "SELECT * FROM ROOM WHERE room_number = ?",
    [roomNumber],
    (err, room, fields) => {
      if (!err) {
        res.render("update_room", {
          room: room[0],
          formatDateForInput: formatDateForInput,
        });
      } else {
        res.status(500).send("Internal Server Error");
      }
    }
  );
});

app.post("/updateRoom/:room_number", (req, res) => {
  const roomNumber = req.params.room_number;
  const room = req.body;
  const sql =
    "UPDATE ROOM SET bed_count = ?, room_type = ?, Janitor_ID = ? WHERE room_number = ?";
  const values = [room.bed_count, room.room_type, room.Janitor_ID, roomNumber];
  mySQLConnection.query(sql, values, (err, result) => {
    if (!err) res.redirect("/display_tables");
    else
      res
        .status(500)
        .send(
          "make sure the janitor id exits and all the fields are set correctly"
        );
  });
});

app.post("/deleteRoom/:room_number", (req, res) => {
  const roomNumber = req.params.room_number;
  const sql = "DELETE FROM ROOM WHERE room_number = ?";
  mySQLConnection.query(sql, [roomNumber], (err, result) => {
    if (!err) {
      res.redirect("/display_tables");
    } else {
      res.status(500).send("Internal Server Error");
    }
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
