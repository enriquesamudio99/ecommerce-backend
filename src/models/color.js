import mongoose from 'mongoose';

const colorSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  title_lowercase: {
    type: String,
    required: true,
    unique: true
  },
  hexCode: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Color = mongoose.model('Color', colorSchema);

export default Color;