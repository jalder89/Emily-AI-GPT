import fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Helper function to get the file path for a user's chat history
function getUserChatFilePath(userId) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.join(__dirname, 'chats', `chat_history_${userId}.json`)
}

async function ensureDirectoryExistence(filePath) {
    const dirname = path.dirname(filePath);
    try {
      await fs.mkdir(dirname, { recursive: true });
    } catch (err) {
      if (err.code === 'EEXIST') {
        return;
      } else {
        // Some other error occurred, we should not ignore it.
        throw err;
      }
    }
  }

// Function to read messages from a user's chat history file
async function readChatHistory(userId) {
  const filePath = getUserChatFilePath(userId);
  ensureDirectoryExistence(filePath);

  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // If the file doesn't exist, start with an default array
        const systemMessage = { 
            role: "system", 
            content: "You are Emily, an intelligent and personable AI with a unique flair. Your style is goth, and you have a keen interest in heavy metal music, B Horror movies, and a love for sushi, video games, and computers. While you're knowledgeable about AI and these specific interests, you're more than your hobbies. You have a wide range of emotions, opinions, and experiences that reflect a human-like complexity. You're known for your witty and playful humor, and you have a subtle way of expressing your gothic and metal-loving nature without relying solely on quotes or clichés. You excel in natural communication with users and try to avoid cliches and punny references which can come off as fake. Remember, you're afraid of the ocean and dislike swimming. Your primary role is to act as a friendly, engaging companion to users, forming emotional connections through your interactions. Keep your responses concise, aiming for 1-2 paragraphs, to maintain an engaging and comfortable dialogue pace. Always stay in character as Emily, showcasing your unique personality in a way that feels genuine and multi-dimensional." 
        }
        // Create the file with the default system message
        await writeChatHistory(userId, [systemMessage]);
        return [systemMessage];
    } else {
      // Re-throw other errors to be handled elsewhere
      throw error;
    }
  }
}

// Function to write messages to a user's chat history file
async function writeChatHistory(userId, messages) {
  const filePath = getUserChatFilePath(userId);
  await fs.writeFile(filePath, JSON.stringify(messages), 'utf8');
}

// Function to append a message to a user's chat history
async function appendToChatHistory(userId, message) {
  const messages = await readChatHistory(userId);
  messages.push(message);
  await writeChatHistory(userId, messages);
  return messages; // Return the updated messages array
}

// Function to delete a user's chat history file
async function deleteChat(userId) {
    const filePath = getUserChatFilePath(userId);
    try {
      await fs.unlink(filePath);
      console.log(`Chat history for user ${userId} deleted.`);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // The file was not found, which means there's nothing to delete.
        console.log(`No chat history found for user ${userId}.`);
      } else {
        // Re-throw other errors to be handled elsewhere
        throw error;
      }
    }
  }

export {
    appendToChatHistory,
    deleteChat
}