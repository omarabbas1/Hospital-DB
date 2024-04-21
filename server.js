const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

// Create the connection to the MySQL database
const mySQLConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "2389",
  database: "Hospital",
});

// Open a connection to the MySQL database
mySQLConnection.connect((err) => {
  if (!err) console.log("Database connection created successfully!");
  else console.log("Error connecting to the database: " + err.message);
});

// Render the index page with buttons to redirect to CRUD operation pages
app.get("/", (req, res) => {
  res.render("index");
});

// Render the page to choose a table to create
app.get("/create_staff", (req, res) => {
  res.render("create_janitor");
});

// Render the form to create a new janitor
app.get("/create_janitor", (req, res) => {
  res.render("create_janitor");
});

// Handle adding a new janitor
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
    if (!err) res.redirect("/display_staff");
    else
      res
        .status(500)
        .send(
          "Error inserting entry, make sure you are not using the same primary key and the data is is in the right format"
        );
  });
});

// Include the formatDate function from the utils.js file
const { formatDate, formatDateForInput } = require("./utils");

app.get("/display_staff", (req, res) => {
  mySQLConnection.query(
    "SELECT * FROM janitor_view",
    (err, janitorsFromView, fields) => {
      if (err) {
        res.status(500).send("Internal Server Error");
        return;
      }

      mySQLConnection.query(
        "SELECT * FROM JANITOR",
        (err, janitorsFromTable, fields) => {
          if (err) {
            res.status(500).send("Internal Server Error");
            return;
          }

          // Pass the formatDate function to the EJS template
          res.render("display_janitor", {
            janitorsFromTable: janitorsFromTable,
            janitorsFromView: janitorsFromView,
            formatDate: formatDate, // Now the function is available in your EJS template
          });
        }
      );
    }
  );
});

// Render the update janitor page with the janitor's details pre-filled
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

// Handle updating a janitor
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
    if (!err) res.redirect("/display_staff");
    else res.status(500).send("Internal Server Error");
  });
});

// Handle deleting a janitor
app.post("/deleteJanitor/:janitor_id", (req, res) => {
  const janitorId = req.params.janitor_id;
  const sql = "DELETE FROM JANITOR WHERE Janitor_ID = ?";
  mySQLConnection.query(sql, [janitorId], (err, result) => {
    if (!err) {
      res.redirect("/display_staff"); // Redirect to the staff display page
    } else {
      res.status(500).send("Internal Server Error");
    }
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
