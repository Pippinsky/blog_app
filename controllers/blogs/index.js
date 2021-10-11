const Blog = require('../../models/blogs');
const Author = require('../../models/authors');
const { decodeToken } = require('../../middleware/auth');

const getAllBlogs = async (req, res, next) => {
    try {
        const allBlogs = await Blog.find().sort('title')
        return res.status(200).json({allBlogs, nbHits: allBlogs.length})
    } 
    catch(err) {
        return res.status(404).json(err);
    }
}

const searchBlogs = async (req, res, next) => {
    // if the search term is longer than one word, the words should be divided with "-" in the query
    let { term } = req.query;
    term = term.trim().split('-').join(' ');

    const blogTitle = {$regex: term, $options: 'i'};
    const blogContent = {$regex: term, $options: 'i'};

    try {
        const matchedBlogs = await Blog.find( { $or: [ { content: blogContent }, { title: blogTitle } ] } ).sort({publishedDate: -1})
        return res.status(200).json({matchedBlogs, nbHits: matchedBlogs.length});
    } catch (error) {
        return res.status(500).json(error);
    }
}

const getBlogsByCategory = async (req, res, next) => {
    const category = req.params.category;

    try {
        const blogs = await Blog.find({ category: {
            // $regex: new RegExp('^' + category.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$', 'i')
            $regex: category, $options: 'i'
        } });
        try {
            return res.status(200).json(blogs)
        } catch(err) {
            return res.status(500).json(err)
        }
    } catch(err) {
        return res.status(500).json(err)
    }
};

const getBlogBySlug = async (req, res, next) => {
    const category = req.params.category;
    const slug = req.params.slug;

    try {
        const blog = await Blog.findOne({ slug: {
            // $regex: new RegExp('^' + slug.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$', 'i')
            $regex: slug, $options: 'i'
        } });
        try {
            return res.status(200).json(blog)
        } catch(err) {
            return res.status(500).json(err)
        }
    } catch(err) {
        console.log(`the error is in the catch block ${err}`);
        return res.status(500).json(err)
    }
};

// const addBlog = async (req, res, next) => {
//     const { title, content, author } = req.body;
//     let { slug, category } = req.body;

//     if (!title || !category || !content || !author) {
//         return res.status(400).json('Fill all fields.')
//     }
//     if (!slug || slug === undefined) {
//         slug = title.split(' ').join('-').toString().toLowerCase();
//     }
    
//     category = category.split(' ').join('-');
    
//     try {
//         const blog = await Blog.create({title, category, slug, content, author});
//         return res.status(200).json(blog);
//     } catch (error) {
//         return res.status(500).json(error);
//     }
// };

const addBlog = async (req, res, next) => {
    const { content } = req.body;
    let { title, slug, category } = req.body;
    const authorInfo = decodeToken(req);
    const authorName = authorInfo.username;
    const authorId = authorInfo.id;
    
    if (!title || !category || !content) {
        return res.status(400).json('Fill all fields.')
    }

    category = category.trim().split(' ').join('-');
    title = title.trim();

    if (!slug || slug === undefined) {
        slug = title.split(' ').join('-').toString().toLowerCase();
    }

    try {
        // add blog to DB
        const blog = await Blog.create({title, category, slug, content, author: authorName});
        const blogId = blog._id;

        // update author
        let blogsArray = await Author.findById(authorId).select('blogs');
        console.log(blogsArray);
        blogsArray = blogsArray.blogs;
        console.log(blogsArray);

        blogsArray = blogsArray.push('blogId') // (wtf? zsh ne rabotit?)
        // blogsArray = [...blogsArray, blogId]
        console.log(blogsArray);

        // console.log(blogId);
        // await Author.findByIdAndUpdate(authorId, {blogs: blogsArray})

        return res.status(200).json(blog);
    } catch (error) {
        return res.status(500).json(error);
    }
};

const deleteBlog = async(req, res, next) => {
    const id = req.params.id;

    try {
        await Blog.findByIdAndDelete(id);
        return res.status(200).json('Blog deleted')
    }
    catch(err) {
        return res.status(500).json(err)
    }
}


module.exports = {
    getAllBlogs,
    searchBlogs,
    getBlogsByCategory,
    getBlogBySlug,
    addBlog,
    deleteBlog,
}