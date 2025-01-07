import mongoose, { Schema, Document } from 'mongoose';

export interface ISeasonGame extends Document {
  name: string;
  imageurl: string;
  url: string;
  isfavourite: boolean;
}

const seasonGameSchema: Schema = new Schema({
  name: { type: String, required: true },
  imageurl: { type: String, required: true },
  url: { type: String, required: true },
  isfavourite: { type: Boolean, default: false }
});

const SeasonGame = mongoose.models.SeasonGame || mongoose.model<ISeasonGame>('SeasonGame', seasonGameSchema);

export default SeasonGame;
