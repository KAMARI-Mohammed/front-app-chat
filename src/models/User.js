const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Email validation
const emailValidator = {
    validator: function(email) {
        const regex = /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return regex.test(email);
    },
    message: 'Please enter a valid email address'
};

const userSchema = new mongoose.Schema({
    username: { type: String, required: [true, 'Username is required'] },
    email: { type: String, required: [true, 'Email is required'], unique: true },
    password: { type: String, required: [true, 'Password is required'] }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        this.password = await bcrypt.hash(this.password, 8);
        next();
    } catch (error) {
        next(error); // Properly handle error
    }
});

userSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
