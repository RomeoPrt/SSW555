class VoiceAssistant {
    constructor() {
        this.isListening = false;
        this.recognition = null;
        this.isProcessing = false;
        this.audioContext = null;
        this.setupElements();
        this.setupSpeechRecognition();
    }

    setupElements() {
        this.toggleButton = document.getElementById('toggleButton');
        this.statusMessage = document.getElementById('statusMessage');
        this.conversationContainer = document.getElementById('conversationContainer');
        this.waves = document.querySelectorAll('.wave');
        
        this.toggleButton.addEventListener('click', () => this.toggleListening());
    }

    setupSpeechRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = true;

            this.recognition.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                        this.processTranscript(transcript);
                    } else {
                        interimTranscript += transcript;
                    }
                }

                if (interimTranscript) {
                    this.updateOrCreateMessage('user', interimTranscript, true);
                }
                if (finalTranscript) {
                    this.updateOrCreateMessage('user', finalTranscript);
                }
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.stopListening();
            };
        } else {
            this.toggleButton.disabled = true;
            this.statusMessage.textContent = 'Speech recognition not supported in this browser';
        }
    }

    updateOrCreateMessage(role, content, isInterim = false) {
        const messageId = isInterim ? 'interim-message' : Date.now().toString();
        let messageElement = document.getElementById(messageId);
        
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.id = messageId;
            messageElement.className = `message ${role}-message`;
            this.conversationContainer.appendChild(messageElement);
        }
        
        messageElement.textContent = content;
        this.conversationContainer.scrollTop = this.conversationContainer.scrollHeight;
    }

    async playAudio(audioUrl) {
        const audio = new Audio(audioUrl);
        try {
            await audio.play();
        } catch (error) {
            console.error('Error playing audio:', error);
        }
    }

    async processTranscript(transcript) {
        if (this.isProcessing) return;
        this.isProcessing = true;
        
        console.log('Processing transcript:', transcript); // Add this debug log
        
        try {
            const response = await fetch('/api/process-voice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ transcript })
            });
            
            console.log('Response status:', response.status); // Add this debug log
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const result = await response.json();
            console.log('Processed result:', result); // Add this debug log
            
            if (result.success) {
                this.updateOrCreateMessage('ai', result.response);
            } else {
                this.updateOrCreateMessage('ai', result.error || 'Sorry, I encountered an error processing your request.');
            }
        } catch (error) {
            console.error('Error processing transcript:', error);
            this.updateOrCreateMessage('ai', 'Sorry, I encountered an error processing your request.');
        } finally {
            this.isProcessing = false;
        }
    }

    toggleListening() {
        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }

    startListening() {
        this.isListening = true;
        this.recognition.start();
        this.toggleButton.textContent = 'Stop Listening';
        this.toggleButton.classList.remove('inactive');
        this.toggleButton.classList.add('active');
        this.statusMessage.textContent = 'Listening...';
        this.statusMessage.classList.remove('not-listening');
        this.statusMessage.classList.add('listening');
        this.waves.forEach(wave => wave.style.display = 'block');
    }

    stopListening() {
        this.isListening = false;
        this.recognition.stop();
        this.toggleButton.textContent = 'Start Listening';
        this.toggleButton.classList.remove('active');
        this.toggleButton.classList.add('inactive');
        this.statusMessage.textContent = 'Microphone is inactive';
        this.statusMessage.classList.remove('listening');
        this.statusMessage.classList.add('not-listening');
        this.waves.forEach(wave => wave.style.display = 'none');
    }
}

// Initialize the voice assistant when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new VoiceAssistant();
});