const express = require('express');
const mongoose = require('mongoose');
const Set = require('../models/Set'); // Ensure correct path to your Set model

const router = express.Router();

// Route to create a new Set with step = 1 and paid = true
router.post('/', async (req, res) => {
    try {
        const newSet = new Set({
            step: 1,
            paid: true,
            readyMade: true
        });
        await newSet.save();
        res.status(201).json({ message: 'Set created successfully', set: newSet });
    } catch (error) {
        res.status(500).json({ message: 'Error creating set', error: error.message });
        console.log(error)
    }
});

// Route to get all Sets with setType = 'readyMade'
router.get('/all', async (req, res) => {
    try {
        const sets = await Set.find({ readyMade: true });
        res.status(200).json(sets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sets', error: error.message });
    }
});

// Route to delete a Set by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Set.findByIdAndDelete(id);
        res.status(200).json({ message: 'Set deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting set', error: error.message });
    }
});

// Basic frontend with a button to create a new Set and table to display sets
router.get('/', async (req, res) => {
    const sets = await Set.find({ readyMade: true });
    console.log(sets);

    const setRows = sets.map(set => `
        <tr>
            <td>${set._id}</td>
            <td>${set.step}</td>
            <td>${set.paid}</td>
            <td>
                <button onclick="removeSet('${set._id}')">Remove</button>
            </td>
        </tr>
    `).join('');

    res.send(`
        <html>
            <body>
                <h1>Create a New Set</h1>
                <button onclick="createSet()">Create Set</button>
                <p id="response"></p>
                <h2>All Ready-Made Sets</h2>
                <table border="1">
                    <tr>
                        <th>ID</th>
                        <th>Step</th>
                        <th>Paid</th>
                        <th>Action</th>
                    </tr>
                    ${setRows}  <!-- Now properly injected -->
                </table>
                <script>
                    async function createSet() {
                        const response = await fetch('/api/createSet/', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' }
                        });
                        const data = await response.json();
                        document.getElementById('response').innerText = data.message;
                        location.reload();
                    }
                    async function removeSet(id) {
                        await fetch('/api/createSet/' + id, {
                            method: 'DELETE'
                        });
                        location.reload();
                    }
                </script>
            </body>
        </html>
    `);
});


module.exports = router;