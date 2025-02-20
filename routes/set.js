const express = require('express');
const mongoose = require('mongoose');
const Set = require('../models/Set'); // Import the Set model
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Create a new set entry
router.post('/',authenticateToken, async (req, res) => {
    const body = {...req.body ,user: req.user.id}
    console.log(body)
    try {
        const set = new Set(body);
        const response = await set.save();
        res.status(201).json(response._id);
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log(error)
    }
});

// Update an existing set entry
router.put('/sets/:id', async (req, res) => {
    try {
        const set = await Set.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!set) {
            return res.status(404).json({ error: 'Set entry not found' });
        }
        res.json(set);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a set entry
router.delete('/sets/:id', async (req, res) => {
    try {
        const set = await Set.findByIdAndDelete(req.params.id);
        if (!set) {
            return res.status(404).json({ error: 'Set entry not found' });
        }
        res.json({ message: 'Set entry deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


router.get('/check-uname/:uname', async (req, res) => {
    try {
        const { uname } = req.params;

        // Check if a document with the given uname exists
        const existingSet = await Set.findOne({ uname });

        if (existingSet) {
            return res.status(200).json({ available: false, message: "Username is already taken" });
        } else {
            return res.status(200).json({ available: true, message: "Username is available" });
        }
    } catch (error) {
        console.error("Error checking uname:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/card",authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(userId)
        // Find all sets belonging to the user and populate the 'card' field
        const sets = await Set.find({ user: userId }).populate("card");

        if (!sets.length) {
            return res.status(404).json({ message: "No sets found for this user" });
        }

        res.status(200).json(sets);
    } catch (error) {
        console.error("Error fetching user sets:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get("/singlecard/:id",authenticateToken, async (req, res) => {
    try {
        // Find all sets belonging to the user and populate the 'card' field
        const sets = await Set.findById(req.params.id).populate("card");

        if (!sets) {
            return res.status(404).json({ message: "No sets found for this user" });
        }

        res.status(200).json(sets);
    } catch (error) {
        console.error("Error fetching user sets:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.put("/update-set/:setId", async (req, res) => {
    try {
        const { setId } = req.params;
        const { address } = req.body;


        const updatedSet = await Set.findByIdAndUpdate(
            setId,
            { 
                address, 
                paid: true ,
                step:4
            },
            { new: true, runValidators: true }
        );

        if (!updatedSet) {
            return res.status(404).json({ error: "Set not found" });
        }

        res.status(200).json({ message: "Set updated successfully", updatedSet });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});




module.exports = router;
