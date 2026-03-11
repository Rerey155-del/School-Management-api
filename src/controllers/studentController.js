const pool = require('../config/db');

const getStudents = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM students');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudentById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM students WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Student not found" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createStudent = async (req, res) => {
  const { name, nis, gender, class_name, enrollment_status } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO students (name, nis, gender, class_name, enrollment_status) VALUES (?, ?, ?, ?, ?)',
      [name, nis, gender, class_name, enrollment_status || 'Aktif']
    );
    res.status(201).json({ id: result.insertId, name, nis, gender, class_name, enrollment_status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const [result] = await pool.query(
      'UPDATE students SET ? WHERE id = ?',
      [req.body, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Student not found" });
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM students WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStudents, getStudentById, createStudent, updateStudent, deleteStudent };
