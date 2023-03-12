import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import { registerValidator, loginValidator, postCreateValidator } from './utils/validations.js';
import checkAuth from './utils/checkAuth.js';
import handleValidationErrors from './utils/handleValidationErrors.js';
import { UserController, PostController } from './controllers/index.js';
//=========================================================================================================================

mongoose
	.set("strictQuery", true)
	.connect('mongodb+srv://admin:admin123@cluster0.iadlc0k.mongodb.net/blog?retryWrites=true&w=majority')
	.then(() => console.log('Подключено к MongoDB!'))
	.catch((err) => console.log('Ошибка подключения к MongoDB!', err));


/* Middleware */
const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

/* Storage */
const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, 'uploads');
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	},
});
const upload = multer({ storage });


/* Routes */
// User routes
app.post('/auth/register', registerValidator, handleValidationErrors, UserController.register);
app.post('/auth/login', loginValidator, handleValidationErrors, UserController.login);
app.get('/auth/me', checkAuth, UserController.getMe);

// Post routes
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidator, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidator, handleValidationErrors, PostController.update);

// Upload route
app.post('/upload', upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	})
});


app.listen(4444, (err) => {
	if (err) console.log('Ошибка запуска локального сервера!');
	console.log('Локальный сервер запущен!');
});