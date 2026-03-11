const pool = require('../config/db');

// List all teachers
const getTeachers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM teachers');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single teacher by ID
const getTeacherById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM teachers WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Teacher not found" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new teacher
const createTeacher = async (req, res) => {
  const { name, nip, email, department, status } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO teachers (name, nip, email, department, status) VALUES (?, ?, ?, ?, ?)',
      [name, nip, email, department, status || 'Aktif']
    );
    res.status(201).json({ id: result.insertId, name, nip, email, department, status: status || 'Aktif' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing teacher (PUT)
const updateTeacher = async (req, res) => {
  const { name, nip, email, department, status } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE teachers SET name = ?, nip = ?, email = ?, department = ?, status = ? WHERE id = ?',
      [name, nip, email, department, status, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Teacher not found" });
    res.json({ id: req.params.id, name, nip, email, department, status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Partially update a teacher (PATCH)
const patchTeacher = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM teachers WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Teacher not found" });

    const current = rows[0];
    const { name, nip, email, department, status } = req.body;

    const updated = {
      name: name !== undefined ? name : current.name,
      nip: nip !== undefined ? nip : current.nip,
      email: email !== undefined ? email : current.email,
      department: department !== undefined ? department : current.department,
      status: status !== undefined ? status : current.status
    };

    await pool.query(
      'UPDATE teachers SET name = ?, nip = ?, email = ?, department = ?, status = ? WHERE id = ?',
      [updated.name, updated.nip, updated.email, updated.department, updated.status, req.params.id]
    );

    res.json({ id: req.params.id, ...updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a teacher
const deleteTeacher = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM teachers WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Teacher not found" });
    res.json({ message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  patchTeacher,
  deleteTeacher
};
