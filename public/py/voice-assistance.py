import ollama
import json
import sys
import os
from gtts import gTTS
from pygame import mixer
import logging
from threading import Thread
from concurrent.futures import ThreadPoolExecutor

# Configure logging and constants
logging.basicConfig(filename='voice_assistant.log', level=logging.ERROR)
HISTORY_FILE = "./history.txt"
AUDIO_FILE = "response.mp3"
MAX_WORKERS = 3  # Limit concurrent operations

class VoiceAssistant:
    def __init__(self):
        self.executor = ThreadPoolExecutor(max_workers=MAX_WORKERS)
        self.response_cache = {}  # Simple cache for responses
        mixer.init(frequency=22050)  # Lower audio quality for speed
        self._initialize_ollama()
        self.history = self._load_history()

    def _initialize_ollama(self):
        # Pre-warm the model
        try:
            ollama.chat(model='llama3.2', messages=[
                {'role': 'user', 'content': 'hello'}
            ])
        except Exception as e:
            logging.error(f"Model initialization error: {str(e)}")

    def _load_history(self):
        """Load conversation history from file."""
        if os.path.exists(HISTORY_FILE):
            try:
                with open(HISTORY_FILE, 'r') as f:
                    return json.load(f)
            except Exception as e:
                logging.error(f"Error loading history: {str(e)}")
        return []

    def _save_history(self, user_input, response_text):
        """Save user input and AI response to history file."""
        self.history.append({'user': user_input, 'assistant': response_text})
        try:
            with open(HISTORY_FILE, 'w') as f:
                json.dump(self.history, f, indent=4)
        except Exception as e:
            logging.error(f"Error saving history: {str(e)}")

    def speak(self, text):
        try:
            # Use a lower quality setting for faster synthesis
            tts = gTTS(text=text, lang='en', slow=False)
            tts.save(AUDIO_FILE)
            
            mixer.music.load(AUDIO_FILE)
            mixer.music.play()
            return True
        except Exception as e:
            logging.error(f"Error in speak function: {str(e)}")
            return False

    def query_llama(self, prompt):
        if not prompt:
            return {"success": False, "error": "No input received"}

        # Check cache first
        cache_key = prompt.strip().lower()
        if cache_key in self.response_cache:
            return self.response_cache[cache_key]

        # Include history in the prompt
        messages = [{'role': 'user', 'content': history['user']} for history in self.history]
        messages += [{'role': 'assistant', 'content': history['assistant']} for history in self.history]
        messages.append({'role': 'user', 'content': prompt})

        try:
            response = ollama.chat(
                model='llama3.2', 
                messages=messages,
                options={
                    'num_predict': 150,  # Limit response length
                    'temperature': 0.7   # Lower creativity for speed
                }
            )
            
            response_text = response['message']['content']
            
            if response_text:
                # Save to history and synthesize speech
                self._save_history(prompt, response_text)
                self.executor.submit(self.speak, response_text)
                
                result = {
                    'success': True,
                    'response': response_text,
                }
                
                # Cache the response
                self.response_cache[cache_key] = result
                return result
            
            return {'success': False, 'error': "No response generated"}
            
        except Exception as e:
            logging.error(f"Error in query_llama: {str(e)}")
            return {'success': False, 'error': str(e)}

def main():
    assistant = VoiceAssistant()
    print(json.dumps({"status": "initialized"}), flush=True)
    
    for line in sys.stdin:
        input_message = line.strip()
        if input_message:
            result = assistant.query_llama(input_message)
            print(json.dumps(result), flush=True)
            sys.stdout.flush()  # Force immediate output

if __name__ == "__main__":
    main()
