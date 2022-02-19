const mongoose = require('mongoose');
const AppError = require('../utils/appError');

const { Schema } = mongoose;

const counterSchema = new Schema({
  collection_id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

counterSchema.index({ collection_id: 1, seq: 1 }, { unique: true });

const Counter = mongoose.model('Counter', counterSchema);

const autoSequenceModelID = async (modelName, doc, idFieldName, seq, next) => {
  const counter = await Counter.findOneAndUpdate(
    { collection_id: modelName },
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

module.exports = { Counter, autoSequenceModelID };
