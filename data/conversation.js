import fs from 'fs';
import path from 'path';

const HISTORY_FILE = path.join(process.cwd(), 'history.txt');

const getConversationMessages = () => {
    try {
      if (!fs.existsSync(HISTORY_FILE)) {
        fs.writeFileSync(HISTORY_FILE, '');
        return [];
      }
  
      const historyData = fs.readFileSync(HISTORY_FILE, 'utf8');
      const messages = historyData.trim().split('\n');
      const conversationMessages = messages.map(message => {
        const [role, ...contentParts] = message.split(': ');
        const content = contentParts.join(': ');
        return { role: role ? role.toLowerCase() : '', content: content || '' };
      });
      return conversationMessages;
    } catch (error) {
      console.error('Error reading conversation history:', error);
      return [];
    }
  };

export { getConversationMessages }