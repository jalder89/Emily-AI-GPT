import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    role: String,
    content: String
}, { _id: false });

const chatSchema = new mongoose.Schema({
    userID: String,
    teamID: String,
    channelID: String,
    messages: [messageSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { collection: 'chats' });

chatSchema.index({ 'messages.channelId': 1 });
chatSchema.index({ 'messages.teamId': 1 });
chatSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
