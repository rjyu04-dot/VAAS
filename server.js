const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Serve login page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// MySQL connection
const db = mysql.createConnection({
    host: "127.0.0.1",
    port: 3307,
    user: "root",
    password: "root",
    database: "vaas_db"
});

db.connect(err => {
    if (err) {
        console.log("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL");
    }
});

// Handle login form POST
app.post("/", (req, res) => {
    const username = req.body.Username;
    const password = req.body.password;

    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            console.log(err);
            return res.send("Database error");
        }

        if (result.length > 0) {
            res.send("Login Successful ✅");
        } else {
            res.send(`
                <script>
                    alert("No Record found, Please Sign In first.");
                    window.location.href = "/";
                </script>
            `);
        }
    });
});

// Start server
app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on http://127.0.0.1:3000");
});