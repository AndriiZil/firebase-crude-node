const {Router} = require('express');
const router = Router();

const UsersController = require('./users.controller');


router.post('/', UsersController.createUser);

router.get('/', UsersController.getUsers);

router.get('/:id', UsersController.geUserById);

router.put('/:id', UsersController.updateUser);

router.delete('/:id', UsersController.deleteUser);

module.exports = router;