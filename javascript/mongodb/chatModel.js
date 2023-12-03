import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    userID: String,
    teamID: String,
    channelID: String,
    messages: [
        {
            role: String,
            content: String,
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

chatSchema.index({ 'messages.channelId': 1 });
chatSchema.index({ 'messages.teamId': 1 });
chatSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
