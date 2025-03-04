const express = require('express');
const mongoose = require('mongoose');
const Web = require('../models/Web'); // Adjust the path based on your project structure
const Set = require('../models/Set');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// Create a new web entry
router.post('/',authenticateToken, async (req, res) => {
    try {
         const set = await Set.findById(req.body.id);
        console.log(req.body.formData)
        if (!set) {
            return res.status(404).json({ error: "Set not found" });
        }
        let web;

        if (set.web) {
            // If set.card exists, update the existing card
            web = await Web.findByIdAndUpdate(
                set.web, // existing card ID
                { ...req.body.formData, user: req.user.id,webType:req.body.webType }, 
                { new: true } // return updated document
            );
            set.step = 4;
            await set.save();
        } else {
            // If set.card doesn't exist, create a new card
            web = new Web({ ...req.body.formData, user: req.user.id, webType:req.body.webType });
            await web.save();

            // Update set with the new card ID
            set.web = web._id;
            set.step = 4;
            await set.save();
        }
        
        res.status(201).json(web);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/contact',authenticateToken, async (req, res) => {
    try {
         const set = await Set.findById(req.body.id);
        if (!set) {
            return res.status(404).json({ error: "Set not found" });
        }
        let web;

        if (set.web) {
            // If set.card exists, update the existing card
            web = await Web.findByIdAndUpdate(
                set.web, // existing card ID
                { ...req.body.contact, user: req.user.id }, 
                { new: true } // return updated document
            );
            set.step = 3;
            await set.save();
        } else {
            // If set.card doesn't exist, create a new card
            web = new Web({ ...req.body.contact, user: req.user.id });
            await web.save();

            // Update set with the new card ID
            set.web = web._id;
            set.step = 3;
            await set.save();
        }
        console.log(web)
        
        res.status(201).json(web);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update an existing web entry
router.put('/webs/:id', async (req, res) => {
    try {
        const web = await Web.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!web) {
            return res.status(404).json({ error: 'Web entry not found' });
        }
        res.json(web);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a web entry
router.delete('/webs/:id', async (req, res) => {
    try {
        const web = await Web.findByIdAndDelete(req.params.id);
        if (!web) {
            return res.status(404).json({ error: 'Web entry not found' });
        }
        res.json({ message: 'Web entry deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/getWebData/:uname", async (req, res) => {
    try {
        const { uname } = req.params;
        
        // Find the set with the given uname
        const set = await Set.findOne({ uname }).populate("web");
        if (!set || !set.web) {
            return res.status(404).json({ message: "Web data not found" });
        }
        
        const web = set.web;
        const { webType } = web;
        
        let responseData = {};
        
        switch (webType) {
            case "":
                responseData = {
                    name: web.name,
                    company: web.company,
                    phone: web.phone,
                    email: web.email,
                    address: web.address,
                    gstn:web.gstn,
                    uname:set.uname
                };
                break;
            
            case "link":
                responseData = {
                    name: web.name,
                    phone: web.phone,
                    email: web.email,
                    address: web.address,
                    bio: web.bio,
                    profilePicture: web.profilePicture,
                    backgroundImage: web.backgroundImage,
                    links: web.links,
                    name: web.name,
                    company: web.company,
                    gstn:web.gstn,
                };
                break;
            
            case "shop":
                responseData = {
                    logo: web.logo,
                    name: web.name,
                    phone: web.phone,
                    email: web.email,
                    address: web.address,
                    company: web.company,
                    gstn:web.gstn,
                    otherPictures: web.otherPictures,
                    productCategories: web.productCategories,
                    businessHours: web.businessHours,
                    inquiryPreference: web.inquiryPreference,
                };
                break;
            
            case "student":
                responseData = {
                    name: web.name,
                    profession: web.profession,
                    description: web.description,
                    email: web.email,
                    phone: web.phone,
                    profilePicture: web.profilePicture,
                    coverPicture: web.coverPicture,
                    academics: web.academics,
                    address: web.address,
                    skills: web.skills,
                    hobbies: web.hobbies,
                    links: web.links,
                    certifications: web.certifications,
                    languages: web.languages,
                    organizations: web.organizations,
                    achievements: web.achievements,
                    works: web.works,
                    experiences: web.experiences,
                };
                break;
            
            case "externalLink":
                responseData = { externalLink: web.externalLink };
                break;
            
            default:
                return res.status(400).json({ message: "Invalid webType" });
        }
        
        return res.status(200).json({responseData,webType});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


router.get("/getWebDataById/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find the set with the given uname
        const set = await Set.findById(id).populate("web");
        if (!set || !set.web) {
            return res.status(404).json({ message: "Web data not found" });
        }
        
        const web = set.web;
        const { webType } = web;
        
        let responseData = {};
        
        switch (webType) {
            case "":
                responseData = {
                    name: web.name,
                    company: web.company,
                    phone: web.phone,
                    email: web.email,
                    address: web.address,
                    gstn:web.gstn,
                    uname:set.uname
                };
                break;
            
            case "link":
                responseData = {
                    name: web.name,
                    phone: web.phone,
                    email: web.email,
                    address: web.address,
                    bio: web.bio,
                    profilePicture: web.profilePicture,
                    backgroundImage: web.backgroundImage,
                    links: web.links,
                };
                break;
            
            case "shop":
                responseData = {
                    logo: web.logo,
                    name: web.name,
                    phone: web.phone,
                    email: web.email,
                    otherPictures: web.otherPictures,
                    productCategories: web.productCategories,
                    businessHours: web.businessHours,
                    inquiryPreference: web.inquiryPreference,
                };
                break;
            
            case "student":
                responseData = {
                    name: web.name,
                    profession: web.profession,
                    description: web.description,
                    email: web.email,
                    phone: web.phone,
                    profilePicture: web.profilePicture,
                    coverPicture: web.coverPicture,
                    academics: web.academics,
                    address: web.address,
                    skills: web.skills,
                    hobbies: web.hobbies,
                    links: web.links,
                    certifications: web.certifications,
                    languages: web.languages,
                    organizations: web.organizations,
                    achievements: web.achievements,
                    works: web.works,
                    experiences: web.experiences,
                };
                break;
            
            case "externalLink":
                responseData = { externalLink: web.externalLink };
                break;
            
            default:
                return res.status(400).json({ message: "Invalid webType" });
        }
        
        return res.status(200).json({responseData,webType});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/forLink',authenticateToken, async (req, res) => {
    try {
         const set = await Set.findById(req.body.id);
        console.log(req.body.formData)
        if (!set) {
            return res.status(404).json({ error: "Set not found" });
        }
        let web;

        if (set.web) {
            // If set.card exists, update the existing card
            web = await Web.findByIdAndUpdate(
                set.web, // existing card ID
                { ...req.body.formData, user: req.user.id,webType:'link' }, 
                { new: true } // return updated document
            );
            set.step = 5;
            await set.save();
        } else {
            // If set.card doesn't exist, create a new card
            web = new Web({ ...req.body.formData, user: req.user.id, webType:'link' });
            await web.save();

            // Update set with the new card ID
            set.web = web._id;
            set.step = 5;
            await set.save();
        }
        
        res.status(201).json(web);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/getWebDataByIdForLink/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find the set with the given uname
        const set = await Set.findById(id).populate("web");
        if (!set || !set.web) {
            return res.status(404).json({ message: "Web data not found" });
        }
        
        const web = set.web;
        
        let responseData = {};
        
       
                responseData = {
                    name: web.name,
                    phone: web.phone,
                    email: web.email,
                    address: web.address,
                    bio: web.bio,
                    profilePicture: web.profilePicture,
                    backgroundImage: web.backgroundImage,
                    links: web.links,
                }
        
        return res.status(200).json({responseData});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
