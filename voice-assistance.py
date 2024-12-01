# voice-assistance.py
import ollama
import json
import sys
import os

HISTORY_FILE = "./history.txt"

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
        "Assistant: "
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
        
        result = json.dumps({
            'success': True,
            'response': response_text
        })
        
        # Ensure the response is properly flushed
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
    # Read input from Node.js one line at a time
    for line in sys.stdin:
        input_message = line.strip()
        if input_message:
            history = load_history()
            query_llama(input_message, history)
    sys.stdout.flush()