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
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");


const app = express();
const PORT = process.env.PORT || 8000;
dotenv.config({ path: './config.env' });
app.use(cookieParser());
// Middleware
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://reez-one.vercel.app',
      'https://reez.uk/'
    ],    
    credentials: true,
  })
);
app.use(express.json());

const bucketname = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY


const s3 = new S3Client({
  credentials:{
    accessKeyId: accessKey,
    secretAccessKey:secretAccessKey,
  },
  region: bucketRegion
})




  mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('Connected!'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));


  //image upload
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

 app.post('/api/images/', upload.single('image'), async(req, res) => {
  
  // const buffer = await sharp(req.file.buffer).resize({height:1920,width:1080, fit:"contain"}).toBuffer()
try{
  const params = {
    Bucket: bucketname,
    Key: req.body.name,
    Body: req.file.buffer,
    ContentType: req.file.mimetype
  }

  const command = new PutObjectCommand(params)
  
  await s3.send(command)

  res.send(req.body.name)
}
catch(error){
  console.log(error)
}
})
  
   


// Routes
app.use('/api/users', userRoutes);
app.use('/api/card', cardRoutes);
app.use('/api/web', webRoutes);
app.use('/api/set', setRoutes);
app.use('/api/otp', otpRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});    
