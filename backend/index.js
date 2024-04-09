// server.js
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const verifyToken = require("./verifyToken");

const app = express();
const port = 5000;

//database information
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "linkup",
});

app.use(cors());

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to MySQL database");
});

app.use(bodyParser.json());

//registering user
app.post("/register", async (req, res) => {
  const { name, email, phone, country, gender, agree, password } = req.body;

  try {
    // Check if the email already exists in the database
    db.query(
      "SELECT * FROM Users WHERE email = ?",
      [email],
      async (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Error registering user");
        }

        if (result.length > 0) {
          // Email already exists, return error message
          return res.status(400).send("Email already registered");
        }

        // Email does not exist, proceed with registration
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        const sql = `INSERT INTO Users (username, email, password, phone, country, gender, agreed_to_terms) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        db.query(
          sql,
          [name, email, hashedPassword, phone, country, gender, agree],
          (err, result) => {
            if (err) {
              console.log(err);
              res.status(500).send("Error registering user");
            } else {
              console.log("User registered successfully");
              res.status(200).send("User registered successfully");
            }
          }
        );
      }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Error registering user");
  }
});

//logging in user
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the email exists in the database
    db.query(
      "SELECT id, username, password FROM Users WHERE email = ?",
      [email],
      async (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Error logging in");
        }

        if (result.length === 0) {
          // Email not found, return error message
          return res.status(401).send("Invalid email or password");
        }

        // Email found, check password
        const user = result[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          // Passwords don't match, return error message
          return res.status(401).send("Invalid email or password");
        }

        // Passwords match, generate JWT token
        const token = jwt.sign(
          { userId: user.id },
          "I_am_just_mocking_around_relax",
          {
            expiresIn: "1h",
          }
        );

        // Send the token and username in the response
        res.status(200).json({ token, username: user.username });
      }
    );
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("Error logging in");
  }
});

//fetching profile data
app.get("/profile", verifyToken, (req, res) => {
  const userId = req.user.userId;

  // Query the database to fetch profile data for the user
  db.query(
    "SELECT username, email, phone, country, gender, total_friends, active_status, registration_date FROM Users WHERE id = ?",
    [userId],
    (err, result) => {
      if (err) {
        console.error("Error fetching profile data:", err);
        return res.status(500).json({ error: "Error fetching profile data" });
      }

      if (result.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      // Profile data found, send it as a JSON response
      const profileData = result[0];
      res.status(200).json(profileData);
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
