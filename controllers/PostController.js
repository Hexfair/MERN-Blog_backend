import PostModel from '../models/Post.js';
//=========================================================================================================================

export const getAll = async (req, res) => {
	try {
		const posts = await PostModel.find().populate('user', '_id fullName createdAt').exec();

		res.json(posts);

	} catch (err) {
		console.log(err);
		res.status(400).json({ message: 'Ошибка при получении статей' });
	}
};

export const getOne = async (req, res) => {
	try {
		const postId = req.params.id;
		PostModel.findOneAndUpdate(
			{
				_id: postId,
			},
			{
				$inc: { viewsCount: 1 },
			},
			{
				returnDocument: 'after',
			},
			(err, doc) => {
				if (err) {
					return res.status(500).json({ message: 'Не удалось получить статью' });
				};

				if (!doc) {
					return res.status(404).json({ message: 'Статья не найдена' });
				};

				res.json(doc);
			}
		);

	} catch (err) {
		console.log(err);
		res.status(400).json({ message: 'Ошибка при получении статьи' });
	}
};

export const create = async (req, res) => {
	try {
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			tags: req.body.tags,
			imageUrl: req.body.imageUrl,
			user: req.userId,
		});

		const post = await doc.save();

		res.json(post);

	} catch (err) {
		console.log(err);
		res.status(400).json({ message: 'Ошибка при создании статьи' });
	}
};

export const remove = async (req, res) => {
	try {
		const postId = req.params.id;
		PostModel.findByIdAndDelete(
			{
				_id: postId,
			},
			(err, doc) => {
				if (err) {
					return res.status(500).json({ message: 'Не удалось получить статью' });
				};

				if (!doc) {
					return res.status(404).json({ message: 'Статья не найдена' });
				};

				res.json({ message: 'Статья успешно удалена!' });
			}
		)
	} catch (err) {
		console.log(err);
		res.status(400).json({ message: 'Ошибка при удалении статьи' });
	}
};

export const update = async (req, res) => {
	try {
		const postId = req.params.id;
		await PostModel.updateOne(
			{
				_id: postId,
			},
			{
				title: req.body.title,
				text: req.body.text,
				imageUrl: req.body.imageUrl,
				user: req.userId,
				tags: req.body.tags
			},
		)
		res.json({ message: 'Статья успешно обновлена!' });
	} catch (err) {
		console.log(err);
		res.status(400).json({ message: 'Ошибка при обновлении статьи' });
	}
}