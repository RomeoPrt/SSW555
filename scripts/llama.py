import ollama
import speech_recognition as sr
from gtts import gTTS
import os
import pygame  

HISTORY_FILE = "history.txt" # File to store conversation history

# Function to load history from the history.txt file
def load_history():
    """Loads and return history from the history.txt file"""
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE,'r') as file: 
            history = file.read().strip()
        return history
    return "" # Return a empty string if the file does not exist

def save_history(prompt, response):
    """Appends user's prompt and voice assistant's response to the history file."""
    with open(HISTORY_FILE, 'a') as file: 
        file.write(f"User: {prompt}\n") 
        file.write(f"Voice Assistant: {response}\n") 

def AUDIO_FILE():
    return "response.mp3" # Quit the mixer after getting response 

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

def capture_audio(recognizer, source=None):
    """Captures audio from the given source, will default to microphone if no source is provided."""
    if source is None:
        source = sr.Microphone()
    with source:
        print("Listening...")
        try:
            audio = recognizer.listen(source, timeout=10, phrase_time_limit=5)
            return audio
        except sr.WaitTimeoutError:
            print("Listening timed out. Please try speaking again.")
            return None  # Return None if there was a timeout error


def process_audio(audio,recognizer):
    """Processes the captured audio and returns teh transcribed text or error messages."""
    try: 
        text = recognizer.recognize_google(audio)
        print(f"You said: {text}")
        return text
    except sr.UnknownValueError:
        # Only print if the listening loop fails after a command
        print("Sorry, I did not understand that. Please try again.")
        return None 
    except sr.RequestError:
        print("Could not request results; check your network connection.")
        return ""
    except sr.WaitTimeoutError:
        print("Listening timed out. Please try again.")
        return None 

def listen(source = None):
    """Listens for audio and retry until it is possible to return the transcribed text."""
    recognizer = sr.Recognizer()
    while True:  # Keep listening until a valid command is heard
        audio = capture_audio(recognizer, source = source)
        if audio :
            text = process_audio(audio,recognizer)
            if text: 
                return text

def query_llama(prompt,history=""):
    """Queries the Llama model using the Ollama Python API, with history."""
    if not prompt:
        return "I didn't catch that. Please say it again."
    
    # Modify prompt to instruct Llama to respond briefly
    full_prompt = (
        f"{history}\n"
        f"User: {prompt}\n"
        "Assistant: Please keep your response to 1 sentence and within 40 characters."
    )
    
    try:
        response = ollama.chat(model='llama3.2', messages=[
            {
                'role': 'user',
                'content': full_prompt,
            },
        ])
        return response['message']['content']
    except Exception as e:
        print(f"An error occurred while querying Llama: {e}")
        return "I'm having trouble getting a response."

def main():
    history = load_history() # load history to pass into querry_llama function 
    while True:
        command = listen()
        if command is None:
            continue  
        
        if command.lower() == "exit":
            print("Exiting voice assistant.")
            break
        
        # Retrieve response using history as context
        response = query_llama(command,history) 
        print(f"Llama says: {response}")
        speak(response)  
        
        save_history(command, response) 
        # Update history 
        history += f"\nUser: {command}\nAssistant: {response}" 

if __name__ == "__main__":
    main()
