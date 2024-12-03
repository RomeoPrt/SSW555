import ollama
import json
import sys
import os
import pygame
from gtts import gTTS

HISTORY_FILE = "./history.txt"

def AUDIO_FILE():
    return "response.mp3"

def speak(text):
    """Converts text to speech and plays the audio."""
    tts = gTTS(text=text, lang='en')
    tts.save(AUDIO_FILE())

    # Initialize pygame mixer
    pygame.mixer.init()
    pygame.mixer.music.load(AUDIO_FILE())
    pygame.mixer.music.play()

    # Wait for the audio to finish
    while pygame.mixer.music.get_busy():
        continue 

    pygame.mixer.quit()

def load_history():
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, 'r') as file:
            history = file.read().strip()
        return history
    return ""

def save_history(prompt, response):
    os.makedirs(os.path.dirname(HISTORY_FILE), exist_ok=True)
    with open(HISTORY_FILE, 'a') as file:
        file.write(f"User: {prompt}\n")
        file.write(f"Voice Assistant: {response}\n")

def query_llama(prompt, history=""):
    if not prompt:
        return json.dumps({
            'success': False,
            'error': "I didn't catch that. Please say it again."
        })
    
    full_prompt = (
        f"{history}\n"
        f"User: {prompt}\n"
        "Assistant: Respond concisely in 1 sentence and within 40 characters. "
        "Tailor your response based on the user's previously mentioned medical condition or current health status. "
        "For example, if the user mentions hypertension, provide advice such as setting reminders for medication, checking blood pressure regularly, or ensuring they take their medication as prescribed."
    )
    
    try:
        response = ollama.chat(model='llama3.2', messages=[
            {
                'role': 'user',
                'content': full_prompt,
            },
        ])
        
        response_text = response['message']['content']
        save_history(prompt, response_text)
        
        speak(response_text)
        
        result = json.dumps({
            'success': True,
            'response': response_text
        })
        
        print(result, flush=True)
        return result
        
    except Exception as e:
        error_message = f"Error: {str(e)}"
        result = json.dumps({
            'success': False,
            'error': error_message
        })
        print(result, flush=True)
        return result

if __name__ == "__main__":

    for line in sys.stdin:
        input_message = line.strip()
        if input_message:
            history = load_history()
            query_llama(input_message, history)
    sys.stdout.flush()