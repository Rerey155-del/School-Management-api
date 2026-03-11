const pool = require('../config/db');

const getSchedules = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM schedules');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSchedule = async (req, res) => {
  const { class_name, day, period_duration, instructor, subject } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO schedules (class_name, day, period_duration, instructor, subject) VALUES (?, ?, ?, ?, ?)',
      [class_name, day, period_duration, instructor, subject]
    );
    res.status(201).json({ id: result.insertId, class_name, day, period_duration, instructor, subject });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSchedule = async (req, res) => {
  try {
    const [result] = await pool.query(
      'UPDATE schedules SET ? WHERE id = ?',
      [req.body, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Schedule not found" });
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSchedule = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM schedules WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Schedule not found" });
    res.json({ message: "Schedule deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSchedules, createSchedule, updateSchedule, deleteSchedule };
