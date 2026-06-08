import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const pollHistorySchema = new mongoose.Schema(
  {
    pollId: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll' },
    choice: String,
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    // Fair Say NZ-specific fields
    preferredElectorate: {
      type: String,
      trim: true,
      default: '',
    },
    newsletterSubscribed: {
      type: Boolean,
      default: false,
    },
    pollHistory: [pollHistorySchema],
    // Sybil-resistance: identity verification via IRD or ratespayer number.
    // identityHash = HMAC-SHA256(IDENTITY_SECRET, type:normalizedNumber) — the raw number is never stored.
    isVerified: { type: Boolean, default: false },
    verifiedType: { type: String, enum: ['ird', 'ratespayer'], sparse: true },
    verifiedAt: { type: Date },
    identityHash: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

userSchema.pre('save', async function savePassword() {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function toJSON() {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
