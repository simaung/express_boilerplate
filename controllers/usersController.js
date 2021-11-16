import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Users from '../models/userModel.js';
import { v4 as uuidv4 } from 'uuid';

export const getUsers = async(req, res) => {
    try {
        const users = await Users.findAll({
            attributes: {
                exclude: ['id', 'password', 'refresh_token']
            }
        });
        res.json(users);
    } catch (error) {
        console.log(error)
    }
}

export const getUser = async(req, res) => {
    try {
        const user = await Users.findOne({
            where: { uuid: req.params.id },
            attributes: {
                exclude: ['id', 'password', 'refresh_token']
            }
        });
        if (!user) return res.status(404).json({ message: "User doesn't exist" });
        res.json(user);
    } catch (error) {
        console.log(error);
    }
}

export const register = async(req, res) => {
    const { name, email, password, c_password } = req.body;
    try {
        const user = await Users.findOne({
            where: { email: email }
        });
        if (user) return res.status(400).json({ message: "Email is already registered" });

        if (password != c_password) return res.status(400).json({ message: "Confirm Password not equal!" });
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        try {
            await Users.create({
                uuid: uuidv4(),
                name: name,
                email: email,
                password: hashPassword
            });
            res.json({ message: "Register successfully!" });
        } catch (error) {
            console.log(error)
        }
    } catch (error) {
        res.status(500).json({ message: "Something went wrong." });
    }
}

export const login = async(req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Users.findOne({
            where: { email: email }
        });

        if (!user) return res.status(404).json({ message: "User doesn't exist" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "invalid credentials" });

        const accessToken = jwt.sign({ userId: user.id, name: user.name, email: user.email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1h'
        });
        const refreshToken = jwt.sign({ userId: user.id, name: user.name, email: user.email }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });
        await Users.update({ refresh_token: refreshToken }, {
            where: {
                id: user.id
            }
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong." });
    }
}

export const logout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);
    const user = await Users.findOne({
        where: {
            refresh_token: refreshToken
        }
    });
    if (!user) return res.sendStatus(204);
    await Users.update({
        refresh_token: null
    }, {
        where: {
            id: user.id
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}