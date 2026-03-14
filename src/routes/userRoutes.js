const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/login', userController.login);
router.get('/', verifyToken, userController.getUsers);
router.get('/:id', verifyToken, userController.getUserById);
router.post('/', userController.createUser); // Public registration for testing
router.put('/:id', userController.updateUser);
router.patch('/:id', userController.patchUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
