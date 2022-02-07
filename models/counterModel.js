const mongoose = require('mongoose');
const AppError = require('../utils/appError');

const { Schema } = mongoose;

const counterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

counterSchema.index({ _id: 1, seq: 1 }, { unique: true });

const counterModel = mongoose.model('counter', counterSchema);

exports.autoSequenceModelID = async (
  modelName,
  doc,
  idFieldName,
  seq,
  next
) => {
  const counter = await counterModel.findByIdAndUpdate(
    modelName,
    { $inc: { seq } },
    {
      new: true,
      upsert: true,
    }
  );

  if (!counter) {
    return next(
      new AppError(`No counter found with that name ${modelName}`, 404)
    );
  }

  doc[idFieldName] = counter.seq;
  if (seq === 1) next();
};
