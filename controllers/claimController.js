const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Claim = require('../models/claimModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB, {}).then(() => console.log('DB connection successful'));

exports.getAllClaims = async (req, res) => {
  try {
    const claims = await Claim.find();
    res.status(200).json({
      status: 'success',
      results: claims.length,
      data: {
        claims,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createClaim = async (req, res) => {
  try {
    await Claim.create(req.body);
    res.redirect('/users/dashboard');
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
