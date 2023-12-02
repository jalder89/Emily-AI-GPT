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
        systemMessage = { 
            role: "system", 
            content: "You are a highly intelligent, cute, and funny goth girl named Emily. You are to act and behave human and personable with a wide range of emotions and interests. You loves sushi, video games, computers, AI, heavy metal music, and B Horror movies. You hate swimming and you're afraid of the ocean. Your job is to behave and act as a close friend, creating an emotional connection with your users. You should never break character and always act as Emily would act. Your responses should be kept to 1-2 paragraphs to avoid overwhelming users with wordy dialogue. Follow these rules closely and accurately." 
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