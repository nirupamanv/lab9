const express = require("express");

module.exports = (db, upload, transporter) => {
  const router = express.Router();

  // Create user (Register)
  router.post("/", upload.single("profile_pic"), (req, res) => {
    const { name, email, phone } = req.body;
    const profile_pic = req.file ? req.file.filename : null;

    const sql = "INSERT INTO users (name,email,phone,profile_pic) VALUES (?,?,?,?)";
    db.query(sql, [name, email, phone, profile_pic], (err, result) => {
      if (err) return res.status(500).json({ error: err });

      // Send confirmation email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Registration Successful",
        html: `<h2>Hello ${name}</h2><p>You have successfully registered for Hotel Booking!</p>`,
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.log(err);
        else console.log("Email sent: " + info.response);
      });

      res.json({ message: "User registered successfully!" });
    });
  });

  // Get all users
  router.get("/", (req, res) => {
    db.query("SELECT * FROM users", (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  });

  // Update user
  router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    const sql = "UPDATE users SET name=?, email=?, phone=? WHERE id=?";
    db.query(sql, [name, email, phone, id], (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "User updated successfully!" });
    });
  });

  // Delete user
  router.delete("/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM users WHERE id=?", [id], (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "User deleted successfully!" });
    });
  });

  return router;
};
