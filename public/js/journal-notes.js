document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addNoteForm');
    const noteContent = document.getElementById('noteContent');
    const audioNote = document.getElementById('audioNote');
    const recordAudioButton = document.getElementById('recordAudio');
    let mediaRecorder;
    let audioBlob;
    let audioUrl;
  
    // Initialize MediaRecorder for audio recording
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        let audioStream;
        
        recordAudioButton.addEventListener('click', async () => {
            if (!mediaRecorder) {
                try {
                    console.log('Requesting microphone access...');
                    // Request microphone access
                    audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    console.log('Microphone access granted');
                    
                    mediaRecorder = new MediaRecorder(audioStream);
                    
                    mediaRecorder.ondataavailable = event => {
                        audioBlob = event.data;
                        audioUrl = URL.createObjectURL(audioBlob);
                        audioNote.value = audioUrl;  // Store the audio URL in the hidden input field
                        console.log('Audio data available');
                    };
                    
                    mediaRecorder.onstop = () => {
                        console.log('Audio recording stopped');
                    };
                    
                    // Start recording
                    mediaRecorder.start();
                    console.log('Recording started...');
                    recordAudioButton.textContent = 'Stop Recording';
                } catch (err) {
                    console.error('Error accessing microphone:', err);
                    alert('Error accessing microphone. Please allow microphone access.');
                }
            } else {
                // Stop recording
                console.log('Stopping recording...');
                mediaRecorder.stop();
                recordAudioButton.textContent = 'Record Audio';
            }
        });
    } else {
        console.error('Audio recording is not supported on this browser.');
        alert('Your browser does not support audio recording.');
    }
  
    // Handle form submission
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
  
        // Check if note content or audio is provided
        if (noteContent.value.trim() === '' && !audioNote.value) {
            alert('Please add content or record audio before saving.');
            return;
        }
  
        // Prepare the data to send to the backend
        if (noteContent.value.trim() !== '') {
            // Sending a text note to the backend
            const textData = {
                noteText: noteContent.value,
            };
            try {
                const response = await fetch('/api/save-text-note', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(textData),
                });
  
                const result = await response.json();
                if (response.ok) {
                    // Clear the form if the text note was successfully added
                    noteContent.value = '';
                    audioNote.value = '';
                    //alert('Text note saved successfully!');
                    window.location.reload();
                } else {
                    alert('Failed to save the text note. Please try again.');
                }
            } catch (error) {
                console.error('Error submitting text note:', error);
                alert('An error occurred while saving the text note. Please try again later.');
            }
        }

        if (audioNote.value) {
            // Send the audio note to the backend
            const formData = new FormData();
            const audioBlobFile = dataURItoBlob(audioUrl); // Convert the audio URL to a Blob

            formData.append('audio', audioBlobFile, 'audio_note.wav'); // Append the audio blob to the form data

            try {
                const response = await fetch('/api/save-audio-note', {
                    method: 'POST',
                    body: formData,
                });

                const result = await response.json();
                if (response.ok) {
                    // Clear the form if the audio note was successfully added
                    noteContent.value = '';
                    audioNote.value = '';
                    //alert('Audio note saved successfully!');
                    window.location.reload();
                } else {
                    alert('Failed to save the audio note. Please try again.');
                }
            } catch (error) {
                console.error('Error submitting audio note:', error);
                alert('An error occurred while saving the audio note. Please try again later.');
            }
        }
    });

    // Helper function to convert audio URL to Blob
    function dataURItoBlob(dataURI) {
        const byteString = atob(dataURI.split(',')[1]);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uintArray = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
            uintArray[i] = byteString.charCodeAt(i);
        }
        return new Blob([uintArray], { type: 'audio/wav' });
    }
});
