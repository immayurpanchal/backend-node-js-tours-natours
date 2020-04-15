const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell your name']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowerCase: true,
    validate: [validator.isEmail, 'Please provide valid Email']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Provide a password'],
    minlength: 8,
    select: false
  },
  passwordChangedAt: Date,
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works for CREATE and SAVE only
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are not the same'
    }
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  passwordResetToken: String,
  passwordResetExpire: Date
});

userSchema.pre('save', async function(next) {
  // Only run if password is actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete the passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', async function(next) {
  // Only run if password is actually modified
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

/* candidatePassword = pass123
userPassword = encrypted(hashed) pass in the DB
So, normal comparison won't work
pass123 === $2a$12$92VZrtEGW/R7V5jB3viJKu/6o/28.KbB5EOf0ilObSse.fQISwvkq
*/
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseFloat(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < changedTimeStamp;
  }

  // False means not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  /* This token is sent to the user, only user will have to access this token */
  /* Created a token like JWT, Not required too strong like password */
  const resetToken = crypto.randomBytes(32).toString('hex');

  /* Encrypt the token for security reasons else hacker can get the token and reset all the passwords */
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  /* Set password expiry time to 10min only  */
  this.passwordResetExpire = Date.now() + 10 * 60 * 1000; // 10min expire time

  return resetToken;
};
const User = mongoose.model('User', userSchema);

module.exports = User;
