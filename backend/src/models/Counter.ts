import mongoose, { Schema, Document } from "mongoose";

export interface ICounter extends Document {
  id: string;
  seq: number;
}

const CounterSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  seq: { type: Number, default: 1000 }
});

export async function getNextSequenceValue(sequenceName: string): Promise<number> {
  const Counter = mongoose.models.Counter || mongoose.model<ICounter>("Counter", CounterSchema);
  const sequenceDocument = await Counter.findOneAndUpdate(
    { id: sequenceName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return sequenceDocument.seq;
}

export default mongoose.models.Counter || mongoose.model<ICounter>("Counter", CounterSchema);
