const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignore", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        }
    }
},
    {
        timestamps: true
    }
)

// indexing on multple field this will fasten the queries(compund indexing)
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 })

// before saving connection request
// we can write this logic in api level too(its an another approach)
connectionRequestSchema.pre('save', function (next) {
    const connectionRequest = this;
    //check fromUserId is same as toUserId
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error('Cannot Send Connection Request to YourSelf');
    }
    next();
})
module.exports = mongoose.model('ConnectionRequest', connectionRequestSchema);