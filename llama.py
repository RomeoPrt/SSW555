import ollama
import speech_recognition as sr
from gtts import gTTS
import os
import pygame  

# Create a history file to remember conversations 
HISTORY_FILE = "history.txt"

# Function to load history from the history.txt file
def load_history():
    if os.path.exists(HISTORY_FILE): # checks if HISTORY_FILE exists
        with open(HISTORY_FILE,'r') as file: # opens HISTORY_FILE in read only mode, name it file
            history = file.read().strip() # read file as string and remove whitespace or newlines
        return history # return contents in history
    return "" # if file doesn't exist, return empty string

def save_history(prompt, response):
    """Appends the prompt and response to the history file."""
    with open(HISTORY_FILE, 'a') as file: # opens HISTORY_FILE in read only mode, name it file
        file.write(f"User: {prompt}\n") # format to save prompt of user
        file.write(f"Voice Assistant: {response}\n") # format to save response of voice assistant

def speak(text):
    """Converts text to speech and plays the audio."""
    tts = gTTS(text=text, lang='en')
    audio_file = "response.mp3"
    tts.save(audio_file)

    # Initialize pygame mixer
    pygame.mixer.init()
    pygame.mixer.music.load(audio_file)
    pygame.mixer.music.play()

    # Wait for the audio to finish
    while pygame.mixer.music.get_busy():
        continue  # Keep the program running while the audio is playing

    pygame.mixer.quit()  # Quit the mixer after playback

def listen():
    """Listens for audio and returns the transcribed text."""
    r = sr.Recognizer()
    while True:  # Keep listening until a valid command is heard
        with sr.Microphone() as source:
            print("Listening...")
            try:
                audio = r.listen(source, timeout=10, phrase_time_limit=5)
                text = r.recognize_google(audio)
                print(f"You said: {text}")
                return text
            except sr.UnknownValueError:
                # Only print if the listening loop fails after a command
                print("Sorry, I did not understand that. Please try again.")
            except sr.RequestError:
                print("Could not request results; check your network connection.")
                return ""
            except sr.WaitTimeoutError:
                print("Listening timed out. Please try again.")

def query_llama(prompt,history=""):
    """Queries the Llama model using the Ollama Python API, with history."""
    if not prompt:
        return "I didn't catch that. Please say it again."
    
    # Modify prompt to instruct Llama to respond briefly
    full_prompt = (
        f"{history}\n"
        f"User: {prompt}\n"
        "Assistant: Please keep your response to 1-2 sentences."
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
        
        response = query_llama(command,history) 
        print(f"Llama says: {response}")
        speak(response)  
        
        save_history(command, response) # save prompt and response into history
        history += f"\nUser: {command}\nAssistant: {response}" # update history by appending new conversation

if __name__ == "__main__":
    main()
