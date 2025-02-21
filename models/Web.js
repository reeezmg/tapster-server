const mongoose = require("mongoose");

const webSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  webType: {
    type: String,
  },
  name: {
    type: String,
  },
  company:{
    type:String
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  gstn: {
    type: String,
  },
  address: {
    type: String,
  },
  bio: {
    type: String,
  },
  profilePicture: {
    type: String,
  },
  backgroundImage: {
    type: String,
  },
  logo: {
    type: String,
  },
  otherPictures: {
    type: [String],
  },
  productCategories: {
    type: [{}],
  },
  businessHours: {
    Monday: { open: Boolean, openingTime: String, closingTime: String },
    Tuesday: { open: Boolean, openingTime: String, closingTime: String },
    Wednesday: { open: Boolean, openingTime: String, closingTime: String },
    Thursday: { open: Boolean, openingTime: String, closingTime: String },
    Friday: { open: Boolean, openingTime: String, closingTime: String },
    Saturday: { open: Boolean, openingTime: String, closingTime: String },
    Sunday: { open: Boolean, openingTime: String, closingTime: String },
  },
  inquiryPreference: {
    type: String,
  },
  profession:{
    type: String,
  },
  description:{
    type: String,
  },
  coverPicture: {
    type: String,
  },
  academics: {
    type: [{}],
  },
  skills: {
    type: [String],
  },
  hobbies: {
    type: [String],
  },
  links: {
    type: [{}],
  },
  certifications: {
    type: [String],
  },
  languages: {
    type: [String],
  },
  organizations: {
    type: [String],
  },
  achievements: {
    type: [String],
  },
  works: {
    type: [{}],
  },
  experiences: {
    type: [{}],
  },
  externalLink: {
    type: String,
  },
});

module.exports = mongoose.model("Web", webSchema);
