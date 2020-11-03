const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');

const db = require('../../admin');

class UsersController {

    static async createUser(req, res, next) {
        try {
            const { name, age, email } = req.body;

            const id = uuidv4().split('-').join('');

            const docRef = db.doc(id);

            await docRef.set({ id, age, name, email });

            return res.send({ message: `User "${name}" was created.` });
        } catch (err) {
            next(err);
        }
    }

    static async getUsers(req, res, next) {
        try {
            let users = [];

            const { docs } = await db.get();

            if (docs.length) {
                for (const user of docs) {
                    users.push(user.data());
                }
            }

            return res.send(users);
        } catch (err) {
            next(err);
        }
    }

    static async geUserById(req, res, next) {
        try {
            const { id } = req.params;

            UsersController.checkId(id);

            const user = await db.doc(id).get();

            if (!user.exists) {
                const error = new Error(`User with "${id}" does not exists`);
                error.code = 404;
                throw error;
            }

            return res.send({ data: user.data() });
        } catch (err) {
            next(err);
        }
    }

    static async updateUser(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            UsersController.checkId(id);

            if (Object.keys(req.body).length) {
                const user = await db.doc(id).get();
                await db.doc(id).set({
                    ...user.data(),
                    ...updateData
                });
            } else {
                return res.status(422).send({ message: 'Body is empty' });
            }

            return res.send({ message: `User with id: "${id}" was updated` });
        } catch (err) {
            next(err);
        }
    }

    static async deleteUser(req, res, next) {
        try {
            const { id } = req.params;

            UsersController.checkId(id);

            await db.doc(id).delete();

            return res.send({ message: `User with id: "${id}" was deleted.` });
        } catch (err) {
            next(err);
        }
    }

    static checkId(id) {
        if (!id) {
            const error = new Error('"Id" should be specified.');
            error.code = 422;
            throw error;
        }
        return 'success';
    }

    static createUserValidator(req, res, next) {
        const createUserSchema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().required(),
            age: Joi.number().required()
        })

        UsersController.checkError(createUserSchema, req, res, next);
    }

    static updateUserValidator(req, res, next) {
        const updateUserSchema = Joi.object({
            name: Joi.string(),
            email: Joi.string(),
            age: Joi.number()
        });

        UsersController.checkError(updateUserSchema, req, res, next);
    }

    static checkError(schema, req, res, next) {
        const { error } = schema.validate(req.body);

        if (error) {
            const { message } = error.details[0];
            return res.status(422).send({ error: message });
        }
        next();
    }

}

module.exports = UsersController;