import { Router } from "express";
import { registerUser, loginUser } from '../data/user.js';
import { spawn } from 'child_process';
import { getConversationMessages } from '../data/conversation.js';
import { create_medication, get_all_medications, get_medicine_by_id, delete_medication } from '../data/medicine.js';


const router = Router();

// const aiModel = spawn("python3.10", ["voice-assistance.py"], { stdio: ["pipe", "pipe", "inherit"] });
const aiModel = spawn("python3", ["public/py/voice-assistance.py"], { stdio: ["pipe", "pipe", "inherit"] });
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

        const { medicationName, strength, dosageForm, frequency } = req.body;
        
        // Validate the input
        if (!medicationName || !strength || !dosageForm || !frequency) {
            return res.status(400).json({ 
                error: 'All fields (medicationName, strength, dosageForm, frequency) are required' 
            });
        }

        const newMedicine = await create_medication(
            req.session.user._id,
            medicationName,
            Number(strength),
            dosageForm,
            frequency
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


router.route('/logout').get(async (req, res) => {
    req.session.destroy();
    return res.redirect("/");
});

export default router;