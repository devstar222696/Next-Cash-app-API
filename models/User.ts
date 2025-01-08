import mongoose, { Schema, Document } from 'mongoose';

const registerSchema: Schema = new Schema(
  {
    id: { type: String, default: 'none' },
    category: { type: String, default: 'none' },
    // phonenumber: { type: String, default: 'none' },
    nickname: { type: String, default: 'none' },
    status: { type: String, default: 'none' },
    // codenumber: { type: String, default: 'none' },
    loginid: { type: String, default: 'none' },
    passwordcode: { type: String, default: 'none' },
    date: { type: Date, default: Date.now },
    comdate: { type: Date }
  },
  { _id: false }
);

const redeemSchema: Schema = new Schema(
  {
    id: { type: String, default: 'none' },
    amount: { type: Number, default: 0 },
    btc: { type: String, default: '0' },
    paymentoption: { type: String, default: 'none' },
    paymenttype: { type: String, default: 'none' },
    paymentstatus: { type: String, default: 'Processing' },
    dailyChecked: { type: Boolean, default: false },
    bonusChecked: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
    comdate: { type: Date },
    isBonusInitializeTime: {
      type: Date,
      // default: () => {
      // // Step 1: Get the current moment in time (JS Date is UTC-based)
      // const nowUTC = new Date();

      // // Step 2: Format that moment as an HST local-time string
      // // e.g. "2025-01-03 14:05:22"
      // const hstString = formatInTimeZone(nowUTC, 'Pacific/Honolulu', 'yyyy-MM-dd HH:mm:ss');

      // // Step 3: Convert that local HST string back into a real UTC Date object
      // // e.g. If hstString was "2025-01-03 14:05:22" HST, 
      // //      we get a Date that represents 2025-01-03 00:05:22 UTC (offset depends on time of year)
      // const hstMomentAsUTC = zonedTimeToUtc(hstString, 'Pacific/Honolulu');
      // return hstMomentAsUTC;
      // }
    }
  },
  { _id: false }
);

const withdrawalSchema: Schema = new Schema(
  {
    id: { type: String, default: 'none' },
    amount: { type: Number, default: 0 },
    paymentoption: { type: String, default: 'none' },
    paymenttype: { type: String, default: 'none' },
    paymentstatus: { type: String, default: 'Processing' },
    paymentgateway: { type: String, default: 'none' },
    date: { type: Date, default: Date.now },
    comdate: { type: Date }
  },
  { _id: false }
);

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  tag: number;
  email: string;
  emailcode: string;
  phoneno: string;
  isphoneverify: string;
  password: string;
  role: string;
  action: string;
  ip: string;
  token: string;
  verifytoken: string;
  createdAt: Date;
  cashtag: string;
  venmo: string;
  paypal: string;
  zelle: string;
  bitcoin: string;
  usdt: string;
  verifystatus: string;
  register: Array<typeof registerSchema>;
  redeem: Array<typeof redeemSchema>;
  withdrawal: Array<typeof withdrawalSchema>;
}

const userSchema: Schema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: false },
  tag: { type: Number, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  emailcode: { type: String, default: 'none' },
  phoneno: { type: String, required: true, unique: true },
  isphoneverify: { type: String, default: 'no' },
  password: { type: String, required: false },
  role: { type: String, default: 'user' },
  action: { type: String, default: 'yes' },
  ip: { type: String },
  token: { type: String },
  verifytoken: { type: String },
  cashtag: { type: String, default: 'none' },
  venmo: { type: String, default: 'none' },
  paypal: { type: String, default: 'none' },
  zelle: { type: String, default: 'none' },
  usdt: { type: String, default: 'none' },
  bitcoin: { type: String, default: 'none' },
  createdAt: { type: Date, default: Date.now },
  verifystatus: { type: String, default: 'no' },
  register: [registerSchema],
  redeem: [redeemSchema],
  withdrawal: [withdrawalSchema]
});

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
