# SSW555
Project for SSW 555: Voice Assistant 

Members: Nozanin Bahridinova, Allan Joseph, Ivana Lu, Birva Patel, Romeo Willis-Parreott 

Sprint 1: 
* Created skeleton of website called SpeakSmart 
* Implemented front-end for Account Creation 
* Implemented front-end for Timer feature 
* Implemented front-end for Medication Confirmation feature 

Directions: Run on a local server to view this website 

On VS Code: install "Live Server" extension and open index.html file with Live Server 

Voice Assistant with Ollama's Llama 3.2:

This project implements a voice assistant that listens to user commands, interacts with the Llama 3.2 model via the Ollama API, and provides voice responses. It is designed to act as a health assistant for seniors.

Requirements:
* `ollama` Python package
* Access to Llama 3.2 via Ollama (Ensure that Llama 3.2 is installed and running)

Furthur Detailed Instructions to run on VS Code
1. Download ollama from this link https://ollama.com/download
2. In vscode terminal: "ollama pull llama3.2"
Before running ensure you all necessary packages, open cmd in administrator mode 
1. Check python version: "python --version" (should be 3.10)
2. Check pip version: "pip --version" (should be pip 24.2)
* If not updated: "python -m pip install --upgrade pip"
* Check pip version once again using "pip --version"
3. Check pip version: "pipwin --version" (should be pipwin v0.5.2)
* If pipwin is not installed: "pip install pipwin"
* Check pip version once again: "pipwin --version" or "pip show pipwin" (0.5.2)
4. Install speechrecognition gtts pygame: "pip install speechrecognition gtts pygame"
* Check installation: "pip show speechrecognition gtts pygame"
* speechrecognition should be 3.11.0
* gtts should be 2.5.3
* pygame should be 2.6.1
5. Install pyaudio: "pip install pyaudio" or "pipwin install pyaudio"
* Check installation: "pip show pyaudio" (should be 0.2.14)
6. Install ollama: "pip install ollama"
* Check installation: "pip show ollama" (should be 0.3.3)
7. Run program in vscode: "llama.py"

