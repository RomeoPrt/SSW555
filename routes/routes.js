import { Router } from "express";
import { registerUser, loginUser } from '../data/user.js';
import { spawn } from 'child_process';
import { getConversationMessages } from '../data/conversation.js';
import { create_medication, get_all_medications, get_medicine_by_id, delete_medication } from '../data/medicine.js';


const router = Router();

// const aiModel = spawn("python3.10", ["voice-assistance.py"], { stdio: ["pipe", "pipe", "inherit"] });
// const aiModel = spawn("python3", ["public/py/voice-assistance.py"], { stdio: ["pipe", "pipe", "inherit"] });
const aiModel = spawn("python", ["public/py/voice-assistance.py"], { stdio: ["pipe", "pipe", "inherit"] });
let aiBuffer = [];

aiModel.stdout.on("data", (data) => {
    aiBuffer.push(data.toString());
    console.log(`AI Response: ${data.toString()}`);
});

router.route('/').get(async (req, res) => {
    if (req.session.auth) {
        return res.redirect("/home");
    }
    return res.redirect("/login");
});

router.get('/login', (req, res) => {
    res.render('login'); 
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await loginUser(email, password);
        req.session.user = user
        req.session.auth = true
        return res.status(201).redirect("/home");
    } catch (error) {
        return res.status(400).send(error);
    }
});

router.get('/register', (req, res) => {
    req.session.auth = false
    res.render('register'); 
});

router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, age, email, password } = req.body;
        const user = await registerUser(firstName, lastName, Number(age), email, password);
        req.session.user = user
        req.session.auth = true
        return res.status(201).redirect("/home");
    } catch (error) {
        return res.status(400).send(error);
    }
});

router.get('/home', (req, res) => {
    if (!req.session.auth) {
      return res.redirect("/login");
    }
    
    const conversationMessages = getConversationMessages();
    console.log('Conversation Messages:', conversationMessages);
    
    return res.render('home', {
      user: req.session.user,
      title: "Home",
      conversationMessages: conversationMessages
    }); 
});

router.post('/api/process-voice', async (req, res) => {
    const { transcript } = req.body;
    if (!transcript) {
        return res.status(400).json({
            success: false,
            error: 'No transcript provided'
        });
    }

    try {
        aiModel.stdin.write(transcript + '\n');
        const response = await new Promise((resolve, reject) => {
            aiModel.stdout.once('data', data => resolve(data.toString()));
            aiModel.stdout.once('error', reject);
        });
        
        const result = JSON.parse(response);
        res.json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: 'Processing error'
        });
    }
});

router.get('/api/medicine', async (req, res) => {
    try {
        if (!req.session.auth || !req.session.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const medications = await get_all_medications(req.session.user._id);
        return res.json(medications);
    } catch (error) {
        console.error('Error fetching medications:', error);
        return res.status(500).json({ error: error.message || 'Failed to fetch medications' });
    }
});

router.get('/api/medicine/:id', async (req, res) => {
    try {
        if (!req.session.auth || !req.session.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const medicine = await get_medicine_by_id(req.session.user._id, req.params.id);
        return res.json(medicine);
    } catch (error) {
        console.error('Error fetching medication:', error);
        return res.status(404).json({ error: error.message || 'Medication not found' });
    }
});

router.post('/api/medicine', async (req, res) => {
    try {
        if (!req.session.auth || !req.session.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { medicationName, dosage, dosageForm, frequency, totalDoses } = req.body;
        
        // Validate the input
        if (!medicationName || !dosage || !dosageForm || !frequency || !totalDoses) {
            return res.status(400).json({ 
                error: 'All fields (medicationName, dosage, dosageForm, frequency, totalDoses) are required' 
            });
        }

        const newMedicine = await create_medication(
            req.session.user._id,
            medicationName,
            Number(dosage),
            Number(dosage),
            dosageForm,
            frequency,
            Number(totalDoses)
        );

        return res.status(201).json(newMedicine);
    } catch (error) {
        console.error('Error creating medication:', error);
        return res.status(400).json({ error: error.message || 'Failed to create medication' });
    }
});

router.delete('/api/medicine/:id', async (req, res) => {
    try {
        if (!req.session.auth || !req.session.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const result = await delete_medication(req.session.user._id, req.params.id);
        return res.json(result);
    } catch (error) {
        console.error('Error deleting medication:', error);
        return res.status(404).json({ error: error.message || 'Failed to delete medication' });
    }
});

router.get('/medications', async (req, res) => {
    try {
        if (!req.session.auth || !req.session.user) {
            return res.redirect('/login');
        }

        const medications = await get_all_medications(req.session.user._id);
        res.render('medications', { medications });
    } catch (error) {
        console.error('Error rendering medications:', error);
        res.status(500).send('Failed to load medications');
    }
});


import fs from 'fs';
import path from 'path';

const notesFilePath = path.resolve('C:/Users/birva/SpeakSmart/notes/text-notes.txt');
// Route to get the journal page with all notes
router.get('/journal', async (req, res) => {
    try {
        if (!req.session.auth || !req.session.user) {
            return res.redirect('/login');
        }

        console.log('Notes file path:', notesFilePath);
        fs.readFile(notesFilePath, 'utf8', (err, data) => {
            if (err) {
              return res.status(500).send('Error reading notes');
            }
        
            // Split the notes by lines and extract content
            const notes = data.split('\n').map(line => {
              const [timestamp, content] = line.split(' - ');
              return { content: content || '' };
            });
            console.log('Notes:', notes);

            // Render the journal page with the notes
            res.render('journal', { notes: notes });
        });
    } catch (error) {
        console.error('Error rendering journal page:', error);
        res.status(500).send('Failed to load journal');
    }
});

// Route to get a specific note (e.g., /journal/groceries)
router.get('/journal/:category', (req, res) => {
    const category = req.params.category; // Extract category from URL
    console.log('Category:', category);

    fs.readFile(notesFilePath, 'utf8', (err, data) => { 
        if (err) {
            return res.status(500).send('Error reading notes');
        }
    
        // Split the notes by lines and find the category note
        const lines = data.split('\n');
        let foundNote = [];
        let isCategoryFound = false;
    
        // Loop through lines to find the category and its full content
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
    
            // Check if this line contains the category we're looking for
            if (line.includes(category)) {
                isCategoryFound = true;
                foundNote.push(line.split(' - ')[1]); // Add only the content part, not the timestamp
            } 
            // Once the category is found, add subsequent lines (as long as they are part of the note)
            else if (isCategoryFound) {
                // Check if the line starts with '2024' (indicating the start of a new note)
                if (line.startsWith('2024')) {
                    break; // Stop collecting lines once a line starts with '2024'
                }
    
                // Otherwise, keep adding lines as part of the note
                if (line.trim() !== '') {
                    foundNote.push(line); // Add line if it's not empty
                }
            }
        }
 
    console.log(foundNote);
    // If no note was found, return a 404 error
    if (foundNote.length === 0) {
        return res.status(404).send('Note not found');
    }

    // Render the details page with the found note
    res.render('details', { note: foundNote.join('\n') });
});
});

// Save Text Note Route
router.post('/api/save-text-note', async (req, res) => {
    const { noteText } = req.body;
    if (!noteText) {
        return res.status(400).send("No text provided.");
    }
    try {
        const __dirname = path.resolve(); // Get the current directory path
        const filePath = path.join(__dirname, 'notes', 'text-notes.txt'); // Define where to store the text notes
        fs.appendFileSync(filePath, `${new Date().toISOString()} - ${noteText}\n`);
        // return res.status(200).json({ message: 'Text note saved successfully!' });
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send('Error reading updated notes');
            }

            const notes = data.split('\n').map(line => {
                const [timestamp, content] = line.split(' - ');
                return { timestamp, content: content || '' };
            });

            // Return the updated list of notes
            res.status(200).json({ message: 'Text note saved successfully!', notes: notes });
        });
    } catch (error) {
        console.error('Error saving text note:', error);
        return res.status(500).send('Failed to save the text note.');
    }
});

// Save Audio Note Route
router.post('/api/save-audio-note', async (req, res) => {
    const audioFile = req.files?.audio; // Use file upload handling middleware like multer or express-fileupload
    if (!audioFile) {
        return res.status(400).send("No audio file provided.");
    }

    try {
        // Define directory for audio files
        const __dirname = path.resolve(); // Get the current directory path
        const audioDirectory = path.join(__dirname, 'notes', 'audio-notes');
        if (!fs.existsSync(audioDirectory)) {
            fs.mkdirSync(audioDirectory, { recursive: true }); // Create directory if it doesn't exist
        }

        const audioFilePath = path.join(audioDirectory, `audio-note-${Date.now()}.wav`);
        
        // Move the uploaded file to the desired directory
        audioFile.mv(audioFilePath, (err) => {
            if (err) {
                console.error('Error saving audio file:', err);
                return res.status(500).send('Failed to save audio note.');
            }
            
            return res.status(200).json({ message: 'Audio note saved successfully!' });
        });
    } catch (error) {
        console.error('Error saving audio note:', error);
        return res.status(500).send('Failed to save the audio note.');
    }
});

router.route('/logout').get(async (req, res) => {
    req.session.destroy();
    return res.redirect("/");
});

export default router;
