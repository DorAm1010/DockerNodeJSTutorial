const Post = require('../models/postModels');

const getAllPosts = async (req, res, next) => {
    try {
        const posts = await Post.find();
        res.status(200).json({
            status: 'success',
            results: posts.length,
            data: {
                posts
            }
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: 'fail'
        })
    }
}

const getOnePost = async (req, res, next) => {
    try {
        const post = await Post.find(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                post
            }
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: 'fail'
        })
    }
}

const updatePost = async (req, res, next) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            status: 'success',
            data: {
                post
            }
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: 'fail'
        })
    }
}


const deletePost = async (req, res, next) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status: 'success',
            message: `Post with ID ${req.params.id} deleted successfully`
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: 'fail'
        })
    }
}


const createPost = async (req, res, next) => {
    try {
        const post = await Post.create(req.body);
        res.status(200).json({
            status: 'success',
            data: {
                post
            }
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: 'fail'
        })
    }
}


module.exports = {
    getAllPosts,
    getOnePost,
    createPost,
    updatePost,
    deletePost,
}