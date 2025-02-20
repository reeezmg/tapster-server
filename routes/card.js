const express = require('express');
const mongoose = require('mongoose');
const Card = require('../models/Card'); // Adjust the path based on your project structure
const authenticateToken = require('../middleware/auth');
const Set = require('../models/Set');

const router = express.Router();

// Create a new card
router.post('/', authenticateToken, async (req, res) => {
    try {
        const set = await Set.findById(req.body.id);
        
        if (!set) {
            return res.status(404).json({ error: "Set not found" });
        }

        let card;

        if (set.card) {
            // If set.card exists, update the existing card
            card = await Card.findByIdAndUpdate(
                set.card, // existing card ID
                { ...req.body.formData, user: req.user.id }, 
                { new: true } // return updated document
            );
            set.step = 2;
            await set.save();
        } else {
            // If set.card doesn't exist, create a new card
            card = new Card({ ...req.body.formData, user: req.user.id });
            await card.save();

            // Update set with the new card ID
            set.card = card._id;
            set.step = 2;
            await set.save();
        }

        res.status(201).json(card);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

// Update an existing card
router.put('/cards/:id', async (req, res) => {
    try {
        const card = await Card.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }
        res.json(card);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a card
router.delete('/cards/:id', async (req, res) => {
    try {
        const card = await Card.findByIdAndDelete(req.params.id);
        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }
        res.json({ message: 'Card deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
