const db = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

const signup = async (req, res, next) => {
    try {
        let user = await db.User.create(req.body);
        const {_id, username} = user;
        let token = jwt.sign(
            {
                _id,
                username
            },
            process.env.SECRET_KEY
        )
        return res.status(200).json({
            user,
            token 
        });
    } catch(err) {
        if(err.code === 11000){
            err.message = 'Sorry, that username is already taken';
        }
        return next({
            status: 400, 
            message: err.message
        })
    }
}
    
const signin = async (req, res, next) => {
    const { body } = req;
    try {
        let user = await db.User.findOne({username: body.username});
        const {_id, username} = user;
        let isMatch = await user.comparePassword(body.password);
        if(isMatch){
            let token = jwt.sign(
                {
                    _id,
                    username
                },
                process.env.SECRET_KEY
            )
            return res.status(200).json({
                user,
                token 
            });
        } else {
            return res.err({
                status: 400,
                message: 'Invalid Username/Password'
            })
        }
    } catch(err) {
        console.log('Request failed')
        return next({status: 400, message: 'Invalid Username/Password'});
    }
}

module.exports = {
    signup, 
    signin
}