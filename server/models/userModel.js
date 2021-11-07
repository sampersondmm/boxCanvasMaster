const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profileImageUrl: {
        type: String
    },
    canvas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Canvas'
    }]
});

//hash the password before the save
userSchema.pre('save', async function(next){
    try {
        if(!this.isModified('password')){
            return next();
        }
        let hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        return next();
    } catch (err) {
        return next(err);
    }
});

//Compares hashed password to other hashed passwords, if one matches allow user to login
userSchema.methods.comparePassword = async function(candidatePassword, next) {
    console.log('TESTING')
    try {
        let isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (err) {
        return next(err)
    }
}

const User = mongoose.model('User', userSchema);

module.exports = User;