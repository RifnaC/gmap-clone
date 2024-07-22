import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
}); 

// Register Route
export const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({ email, password: hashedPassword });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const url = `http://localhost:5174/verify/${token}`;
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: newUser.email,
      subject: 'Verify Email',
      text: `Please click on the link below to verify your email.\n ${url}`,
    }
    transporter.sendMail(mailOptions,(err, info) =>{ 
      if (err) {
        console.log("Error sending message: " + err);
      } else {
        console.log("Message sent succesfully.");
      }
  });
    return res.json({ msg: 'Registration successful, please check your email to verify your account' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
}

// Verify Email Route
export const verified = async (req, res) => {
  try {
    const token  = req.params.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ msg: 'Invalid verification link' });
    }
   
    if (user.isVerified === true) {
      return res.status(400).json({ msg: 'User is already verified' });
    }
    user.isVerified = true;
    await user.save();

    res.json({ msg: 'Email verified successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
}


// Login Route
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email:email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
    if (!user.isVerified) return res.status(400).json({ msg: 'Please verify your email to login' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, email: user.email } });


  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
}
