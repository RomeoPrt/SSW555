import ollama
import speech_recognition as sr
from gtts import gTTS
import os
import pygame  

def speak(text):
    tts = gTTS(text=text, lang='en')
    audio_file = "response.mp3"
    tts.save(audio_file)

    pygame.mixer.init()
    pygame.mixer.music.load(audio_file)
    pygame.mixer.music.play()

    # Wait for the audio to finish
    while pygame.mixer.music.get_busy():
        continue  # Keep the program running while the audio is playing

    pygame.mixer.quit()  

def listen():
    r = sr.Recognizer()
    while True:  # Keep listening until a valid command is heard
        with sr.Microphone() as source:
            print("Listening...")
            try:
                audio = r.listen(source, timeout=10, phrase_time_limit=10)
                text = r.recognize_google(audio)
                print(f"You said: {text}")
                return text
            except sr.UnknownValueError:
                print("Sorry, I did not understand that. Please try again.")
            except sr.RequestError:
                print("Could not request results; check your network connection.")
                return ""
            except sr.WaitTimeoutError:
                print("Listening timed out. Please try again.")

def query_llama(prompt):
    if not prompt:
        return "I didn't catch that. Please say it again."
    prompt = ' '.join(prompt.split())
    # Modify prompt to instruct Llama to respond briefly
    full_prompt = f"{prompt}. You are a personal health assistant to seniors. Keep your responses brief and 1 sentence long."
    
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
    while True:
        command = listen()
        if command is None:
            continue  
        
        if command.lower() == "exit":
            print("Exiting voice assistant.")
            break
        
        response = query_llama(command)
        print(f"Llama says: {response}")
        speak(response)  

if __name__ == "__main__":
    main()
