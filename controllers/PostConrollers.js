import mongoose from 'mongoose';
import PostModel from '../models/Post.js';
import UserModel from '../models/User.js';

export const create = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageURL: req.body.imageURL,
      user: user,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Не удалось создать статью ' });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Не удалось получить все статьи ' });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = await req.params.id;

    const post = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewCount: 1 } },
      { returnDocuments: 'after' },
    );
    if (!post) {
      res.status(404).json({ message: 'такого поста нет' });
    }
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Не удалось получить статью' });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = await req.params.id;

    const existingPost = await PostModel.findOne({ _id: postId });

    if (!existingPost) {
      return res.status(404).json({ message: 'Такой статьи не существует' });
    }

    await PostModel.deleteOne({ _id: postId });

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Не удалось получить статью' });
  }
};

export const update = async (req, res) => {
  try {
    const postId = await req.params.id;
    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags,
        imageURL: req.body.imageURL,
        user: req.userId,
      },
    );
    res.json({
      success: true,
    });
  } catch (err) {
    return res.status(400).json({ message: 'Не удалось обновить статью' });
  }
};
export const getTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();
    const tags = posts
      .map((post) => post.tags)
      .flat()
      .slice(0, 5);
    res.json(tags);
  } catch (err) {
    return res.status(400).json({ message: 'Не удалось обновить статью' });
  }
};
