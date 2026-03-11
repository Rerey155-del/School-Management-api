const pool = require('../config/db');

const getSubjects = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM subjects');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSubject = async (req, res) => {
  const { subject_name, academic_code, metadata } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO subjects (subject_name, academic_code, metadata) VALUES (?, ?, ?)',
      [subject_name, academic_code, metadata]
    );
    res.status(201).json({ id: result.insertId, subject_name, academic_code, metadata });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSubject = async (req, res) => {
  try {
    const [result] = await pool.query(
      'UPDATE subjects SET ? WHERE id = ?',
      [req.body, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Subject not found" });
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM subjects WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Subject not found" });
    res.json({ message: "Subject deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSubjects, createSubject, updateSubject, deleteSubject };
