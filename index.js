const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/card');
const setRoutes = require('./routes/set');
const webRoutes = require('./routes/web');
const otpRoutes = require('./routes/otp');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const serverless = require("serverless-http");

dotenv.config({ path: './config.env' });

const app = express();
app.use(cookieParser());

// Middleware
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://reez-one.vercel.app',
      'https://reez.uk/',
    ],
    credentials: true,
  })
);
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// AWS S3 Configuration
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
  region: process.env.BUCKET_REGION,
});

// Image Upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/api/images/', upload.single('image'), async (req, res) => {
  try {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: req.body.name,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);
    res.send({ message: 'Image uploaded successfully', filename: req.body.name });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Image upload failed' });
  }
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/card', cardRoutes);
app.use('/api/web', webRoutes);
app.use('/api/set', setRoutes);
app.use('/api/otp', otpRoutes);

module.exports = serverless(app);
