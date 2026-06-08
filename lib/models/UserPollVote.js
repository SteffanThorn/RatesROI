import mongoose from 'mongoose';

const userPollVoteSchema = new mongoose.Schema(
  {
    // Nullable — allows anonymous votes tracked by sessionId instead
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    poll: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Poll',
      default: null,
    },
    // String-keyed polls (hardcoded on frontend) use pollSlug instead of poll ObjectId
    pollSlug: { type: String, trim: true },
    // For election/general polls: the option label chosen.
    // For pairwise polls: the winning CivicEvent ObjectId as a string.
    choice: { type: String, required: true },
    // Anonymous session fingerprint (stored client-side in localStorage)
    sessionId: { type: String, trim: true },
    // Verified-identity nullifier: HMAC(secret, identityHash:pollSlug) — prevents double-voting
    // without storing any personal information. Unique per person per poll.
    nullifier: { type: String, trim: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

// Prevent double-voting: one vote per user per poll (or one per sessionId per poll)
userPollVoteSchema.index(
  { user: 1, poll: 1 },
  { unique: true, partialFilterExpression: { user: { $ne: null } } }
);
userPollVoteSchema.index(
  { sessionId: 1, poll: 1 },
  { unique: true, partialFilterExpression: { sessionId: { $exists: true, $ne: null } } }
);
// One nullifier per poll — the core sybil-resistance guarantee
userPollVoteSchema.index(
  { nullifier: 1 },
  { unique: true, partialFilterExpression: { nullifier: { $exists: true, $ne: null } } }
);
userPollVoteSchema.index({ poll: 1 });
userPollVoteSchema.index({ pollSlug: 1 });

const UserPollVote =
  mongoose.models.UserPollVote || mongoose.model('UserPollVote', userPollVoteSchema);

export default UserPollVote;
