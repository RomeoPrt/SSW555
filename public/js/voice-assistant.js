class VoiceAssistant {
    constructor() {
        this.isListening = false;
        this.recognition = null;
        this.isProcessing = false;
        this.messageBuffer = '';
        this.processingDelay = 300; // Reduced delay
        this.setupElements();
        this.setupSpeechRecognition();
        this.pendingRequests = new Set();
    }

    setupSpeechRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            
            // Optimize for speed
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            this.recognition.maxAlternatives = 1;

            // Increase recognition speed
            this.recognition.continuous = false;
            
            this.recognition.onresult = this.handleSpeechResult.bind(this);
            this.recognition.onend = () => {
                if (this.isListening) {
                    this.recognition.start();
                }
            };
        }
    }

    handleSpeechResult(event) {
        if (event.results.length > 0) {
            const transcript = event.results[0][0].transcript;
            this.messageBuffer = transcript;
            this.processSpeech();
        }
    }

    processSpeech() {
        if (!this.messageBuffer || this.isProcessing) return;
        
        this.isProcessing = true;
        const currentText = this.messageBuffer;
        this.messageBuffer = '';

        // Cancel any pending requests
        this.pendingRequests.forEach(controller => controller.abort());
        this.pendingRequests.clear();

        // Create new abort controller for this request
        const controller = new AbortController();
        this.pendingRequests.add(controller);

        fetch('/api/process-voice', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ transcript: currentText }),
            signal: controller.signal
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                this.updateOrCreateMessage('ai', result.response);
            }
        })
        .catch(error => {
            if (error.name === 'AbortError') return;
            console.error('Error:', error);
        })
        .finally(() => {
            this.pendingRequests.delete(controller);
            this.isProcessing = false;
            if (this.messageBuffer) {
                this.processSpeech();
            }
        });

        this.updateOrCreateMessage('user', currentText);
    }

    updateOrCreateMessage(role, content) {
        const div = document.createElement('div');
        div.className = `message ${role}-message`;
        div.textContent = content;
        this.conversationContainer.appendChild(div);
        
        // Optimized scrolling
        if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => {
            this.conversationContainer.scrollTop = this.conversationContainer.scrollHeight;
        }, 10);
    }

    setupElements() {
        // Cache DOM elements
        this.toggleButton = document.getElementById('toggleButton');
        this.statusMessage = document.getElementById('statusMessage');
        this.conversationContainer = document.getElementById('conversationContainer');
        this.waves = document.querySelectorAll('.wave');
        
        this.toggleButton.addEventListener('click', () => this.toggleListening());
    }

    toggleListening() {
        this.isListening ? this.stopListening() : this.startListening();
    }

    startListening() {
        this.isListening = true;
        try {
            this.recognition.start();
            this.toggleButton.textContent = 'Stop Listening';
            this.toggleButton.className = 'active';
            this.statusMessage.textContent = 'Listening...';
            this.waves.forEach(wave => wave.style.display = 'block');
        } catch (error) {
            console.error('Error:', error);
            this.stopListening();
        }
    }

    stopListening() {
        this.isListening = false;
        this.recognition.stop();
        this.toggleButton.textContent = 'Start Listening';
        this.toggleButton.className = 'inactive';
        this.statusMessage.textContent = 'Microphone is inactive';
        this.waves.forEach(wave => wave.style.display = 'none');
    }
}

// Initialize immediately
new VoiceAssistant();