const pool = require('../config/db');

const getUsers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  const { full_name, username, email, role, status } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO users (full_name, username, email, role, status) VALUES (?, ?, ?, ?, ?)',
      [full_name, username, email, role || 'Admin', status || 'Aktif']
    );
    res.status(201).json({ id: result.insertId, full_name, username, email, role, status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  const { full_name, username, email, role, status } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE users SET full_name = ?, username = ?, email = ?, role = ?, status = ? WHERE id = ?',
      [full_name, username, email, role, status, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });
    res.json({ id: req.params.id, full_name, username, email, role, status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const patchUser = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });
    const current = rows[0];
    const updated = { ...current, ...req.body };
    await pool.query(
      'UPDATE users SET full_name = ?, username = ?, email = ?, role = ?, status = ? WHERE id = ?',
      [updated.full_name, updated.username, updated.email, updated.role, updated.status, req.params.id]
    );
    res.json({ id: req.params.id, ...updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, getUserById, createUser, updateUser, patchUser, deleteUser };
