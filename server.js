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
  res.render("choose_table");
});

// Handle selecting a table and redirecting to the appropriate CRUD operation page
app.post("/addData", (req, res) => {
  const { table } = req.body;
  res.redirect(`/create_${table}`);
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
    if (!err) res.redirect("/create_staff");
    else res.status(500).send("Internal Server Error");
  });
});

// Render the form to create a new nurse
app.get("/create_nurse", (req, res) => {
  res.render("create_nurse");
});

// Handle adding a new nurse
app.post("/addNurse", (req, res) => {
  const nurse = req.body;
  const sql =
    "INSERT INTO NURSE (nurse_ID, certifications, working_shift, department, last_name, first_name, hire_date, salary) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    nurse.nurse_ID,
    nurse.certifications,
    nurse.working_shift,
    nurse.department,
    nurse.last_name,
    nurse.first_name,
    nurse.hire_date,
    nurse.salary,
  ];
  mySQLConnection.query(sql, values, (err, result) => {
    if (!err) res.redirect("/create_staff");
    else res.status(500).send("Internal Server Error");
  });
});

// Render the form to create a new room
app.get("/create_room", (req, res) => {
  res.render("create_room");
});

// Handle adding a new room
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
    if (!err) res.redirect("/create_staff");
    else res.status(500).send("Internal Server Error");
  });
});

// Render the form to create a new patient
app.get("/create_patient", (req, res) => {
  res.render("create_patient");
});

// Handle adding a new patient
app.post("/addPatient", (req, res) => {
  const patient = req.body;
  const sql =
    "INSERT INTO PATIENT (patient_id, date_of_birth, phone_number, first_name, last_name, address, insurance_policy_number, insurance_provider, room_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    patient.patient_id,
    patient.date_of_birth,
    patient.phone_number,
    patient.first_name,
    patient.last_name,
    patient.address,
    patient.insurance_policy_number,
    patient.insurance_provider,
    patient.room_number,
  ];
  mySQLConnection.query(sql, values, (err, result) => {
    if (!err) res.redirect("/create_staff");
    else res.status(500).send("Internal Server Error");
  });
});

// Render the form to create a new doctor
app.get("/create_doctor", (req, res) => {
  res.render("create_doctor");
});

// Handle adding a new doctor
app.post("/addDoctor", (req, res) => {
  const doctor = req.body;
  const sql =
    "INSERT INTO DOCTOR (doctor_ID, working_shift, spcialty, department, medical_license_number, patient_id, last_name, first_name, hire_date, salary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    doctor.doctor_ID,
    doctor.working_shift,
    doctor.spcialty,
    doctor.department,
    doctor.medical_license_number,
    doctor.patient_id,
    doctor.last_name,
    doctor.first_name,
    doctor.hire_date,
    doctor.salary,
  ];
  mySQLConnection.query(sql, values, (err, result) => {
    if (!err) res.redirect("/create_staff");
    else res.status(500).send("Internal Server Error");
  });
});

// Render the form to create a new appointment
app.get("/create_appointment", (req, res) => {
  res.render("create_appointment");
});

// Handle adding a new appointment
app.post("/addAppointment", (req, res) => {
  const appointment = req.body;
  const sql =
    "INSERT INTO APPOINTMENT (appointment_id, appointment_time, appointment_date, reason, patient_id) VALUES (?, ?, ?, ?, ?)";
  const values = [
    appointment.appointment_id,
    appointment.appointment_time,
    appointment.appointment_date,
    appointment.reason,
    appointment.patient_id,
  ];
  mySQLConnection.query(sql, values, (err, result) => {
    if (!err) res.redirect("/create_staff");
    else res.status(500).send("Internal Server Error");
  });
});

// Render the form to create a new medical record
app.get("/create_medical_record", (req, res) => {
  res.render("create_medical_record");
});

// Handle adding a new medical record
app.post("/addMedicalRecord", (req, res) => {
  const medicalRecord = req.body;
  const sql =
    "INSERT INTO MEDICAL_RECORD (record_id, diagnoses, allergies, surgical_history, current_medications, nurse_ID, patient_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const values = [
    medicalRecord.record_id,
    medicalRecord.diagnoses,
    medicalRecord.allergies,
    medicalRecord.surgical_history,
    medicalRecord.current_medications,
    medicalRecord.nurse_ID,
    medicalRecord.patient_id,
  ];
  mySQLConnection.query(sql, values, (err, result) => {
    if (!err) res.redirect("/create_staff");
    else res.status(500).send("Internal Server Error");
  });
});

// Render the form to create a new relative
app.get("/create_relative", (req, res) => {
  res.render("create_relative");
});

// Handle adding a new relative
app.post("/addRelative", (req, res) => {
  const relative = req.body;
  const sql =
    "INSERT INTO RELATIVE (relative_id, patient_id, first_name, last_name, relationship_to_patient) VALUES (?, ?, ?, ?, ?)";
  const values = [
    relative.relative_id,
    relative.patient_id,
    relative.first_name,
    relative.last_name,
    relative.relationship_to_patient,
  ];
  mySQLConnection.query(sql, values, (err, result) => {
    if (!err) res.redirect("/create_staff");
    else res.status(500).send("Internal Server Error");
  });
});

// Render the form to create a new edit
app.get("/create_edit", (req, res) => {
  res.render("create_edit");
});

// Handle adding a new edit
app.post("/addEdit", (req, res) => {
  const edit = req.body;
  const sql = "INSERT INTO EDIT (record_id, doctor_id) VALUES (?, ?)";
  const values = [edit.record_id, edit.doctor_id];
  mySQLConnection.query(sql, values, (err, result) => {
    if (!err) res.redirect("/create_staff");
    else res.status(500).send("Internal Server Error");
  });
});

// Render the form to create a new attend
app.get("/create_attend", (req, res) => {
  res.render("create_attend");
});

// Handle adding a new attend
app.post("/addAttend", (req, res) => {
  const attend = req.body;
  const sql =
    "INSERT INTO ATTEND (doctor_ID, patient_ID, appointment_id) VALUES (?, ?, ?)";
  const values = [attend.doctor_ID, attend.patient_ID, attend.appointment_id];
  mySQLConnection.query(sql, values, (err, result) => {
    if (!err) res.redirect("/create_staff");
    else res.status(500).send("Internal Server Error");
  });
});

// Render the form to create a new takes care
app.get("/create_takes_care", (req, res) => {
  res.render("create_takes_care");
});

// Handle adding a new takes care
app.post("/addTakesCare", (req, res) => {
  const takesCare = req.body;
  const sql = "INSERT INTO TAKES_CARE (nurse_ID, room_number) VALUES (?, ?)";
  const values = [takesCare.nurse_ID, takesCare.room_number];
  mySQLConnection.query(sql, values, (err, result) => {
    if (!err) res.redirect("/create_staff");
    else res.status(500).send("Internal Server Error");
  });
});

// Render the form to create a new appointment
app.get("/create_appointment", (req, res) => {
  res.render("create_appointment");
});

// Handle adding a new appointment
app.post("/addAppointment", (req, res) => {
  const appointment = req.body;
  const sql =
    "INSERT INTO APPOINTMENT (appointment_id, appointment_time, appointment_date, reason, patient_id) VALUES (?, ?, ?, ?, ?)";
  const values = [
    appointment.appointment_id,
    appointment.appointment_time,
    appointment.appointment_date,
    appointment.reason,
    appointment.patient_id,
  ];
  mySQLConnection.query(sql, values, (err, result) => {
    if (!err) res.redirect("/create_staff");
    else res.status(500).send("Internal Server Error");
  });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
