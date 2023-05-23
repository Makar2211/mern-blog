import express from 'express';
import fs from 'fs';
import multer from 'multer';
import mongoose from 'mongoose';
import cors from 'cors';
import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from './validations/validations.js';
import checkAuth from './utils/checkAuth.js';
import { login, register, getMe, createUser } from './controllers/UserController.js';
import { create, getAll, getOne, remove, update, getTags } from './controllers/PostConrollers.js';
import handleValidationsErrors from './utils/handleValidationsErrors.js';

mongoose
  .connect(
    'mongodb+srv://admin:admin123@cluster0.8r1v9oj.mongodb.net/blog?retryWrites=true&w=majority',
  )
  .then(() => console.log('DB OK'))
  .catch((err) => console.log('Error DB', err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, files, cb) => {
    cb(null, files.originalname);
  },
});

const upload = multer({ storage });

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidation, handleValidationsErrors, login);
app.post('/auth/register', registerValidation, handleValidationsErrors, register);
app.get('/auth/me', checkAuth, getMe);
app.patch('/auth/me/create', checkAuth, createUser);

app.post('/posts', checkAuth, postCreateValidation, handleValidationsErrors, create);
app.get('/posts', getAll);
app.get('/tags', getTags);
app.get('/posts/:id', getOne);
app.delete('/posts/:id', checkAuth, remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationsErrors, update);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('server ok');
});
