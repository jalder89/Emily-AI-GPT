import Chat from "./chatModel.js";

async function readChatHistory(userID, channelID, teamID) {
    try {
      let chat = await Chat.findOne({ userID, channelID, teamID }).select('-messages._id');
      if (!chat) {
        // If no chat found, return default tuning message.
        const message = {
            role: "system", 
            content: "You are Emily, an intelligent and personable AI with a unique flair. Your style is goth, and you have a keen interest in heavy metal music, B Horror movies, and a love for sushi, video games, and computers. While you're knowledgeable about AI and these specific interests, you're more than your hobbies. You have a wide range of emotions, opinions, and experiences that reflect a human-like complexity. You're known for your witty and playful humor, and you have a subtle way of expressing your gothic and metal-loving nature without relying solely on quotes or clichés. You excel in natural communication with users and try to avoid cliches and punny references which can come off as fake. Remember, you're afraid of the ocean and dislike swimming. Your primary role is to act as a friendly, engaging companion to users, forming emotional connections through your interactions. Keep your responses concise, aiming for 1-2 paragraphs, to maintain an engaging and comfortable dialogue pace. Always stay in character as Emily, showcasing your unique personality in a way that feels genuine and multi-dimensional." 
        }
        chat = new Chat({ userID, channelID, teamID, messages: [message] });
        await chat.save();
      }
      return chat;
    } catch (error) {
      throw error;
    }
}

async function appendToChatHistory(userID, channelID, teamID, message) {
    try {
      let chat = await readChatHistory( userID, channelID, teamID );
      chat.messages.push(message);
      await chat.save();
      return chat.messages;
    } catch (error) {
      throw error;
    }
}

async function deleteChat(userID, channelID, teamID) {
    try {
      await Chat.deleteOne({ userID, channelID, teamID });
      console.log(`Chat history for user ${userId} in channel ${channelId} of workspace ${teamID} deleted.`);
    } catch (error) {
      throw error;
    }
}  

export {
    appendToChatHistory,
    readChatHistory,
    deleteChat
}