const blogModel = require('../models/blogModel');
const authorModel = require('../models/authorModel');
const validators = require('../validators/validator');

const createBlogs = async function (req, res) 
{
    try 
    {
      const requestBody = req.body;
  
      if (!validators.isValidRequestBody(requestBody)) 
      
        return res.status(400).send({ status: false, message: 'Invalid request body. Please provide blog details.' });
      
      if (!validators.isValidField(requestBody.title)) 
      
        return res.status(400).send({ status: false, message: 'Blog title is required!' });
  
      if (!validators.isValidField(requestBody.body)) 
      
        return res.status(400).send({ status: false, message: 'Blog body is required!' });
      
      if (!validators.isValidField(requestBody.authorId)) 
      
        return res.status(400).send({ status: false, message: 'Author id is required!' });
      
      if (!validators.isValidObjectId(requestBody.authorId)) 
      
        return res.status(400).send({ status: false, message: 'Author id is invalid!' });
      
      if (!validators.isValidField(requestBody.category)) 
      
        return res.status(400).send({ status: false, message: 'Blog category is required!' });
      
      let author = await authorModel.findOne({_id : requestBody.authorId});
      if (!author) 
      
        return res.status(400).send({ status: false, message: "Author id not found!" });

      if(requestBody.isPublished)
      
        requestBody.publishedAt = new Date();
      
      let newBlog = await blogModel.create(requestBody);
      res.status(201).send({ status: true, message: 'New blog created successfully.', data: newBlog });
    } 
    catch(error) 
    {
      res.status(500).send({ status: false, msg: error.message });
    }
};

const getBlogs = async function (req, res) 
{
    try 
    {
        let filter={isDeleted : false,isPublished : true};
        if(req.query.category!=undefined)
        {
            filter['category']=req.query.category;
        }
        if(req.query.authorId!=undefined)
        {
            filter['authorId']=req.query.authorId;
        }
        if(req.query.tags!=undefined)
        {
            let tags=JSON.parse(req.query.tags)
                filter['tags']={$in : tags};
        }
        if (req.query.subcategory!=undefined)
        {
            let subcategory=JSON.parse(req.query.subcategory)
            filter['subcategory']={$in : subcategory};
        }
        let blogs=await blogModel.find(filter);
        if (blogs.length!=0) 
        {
            res.status(200).send({ status: true, count : blogs.length, data: blogs });
        } 
        else 
        {
            res.status(404).send({ status: false, message: 'No blogs found!' })
        }
    } 
    catch(error) 
    {
        res.status(400).send({ status: false, error: error.message });
    }
};

const updateBlog = async function(req,res)
{
    try
    {
        if(req.params.blogId==undefined)
        
            return res.status(400).send({ status : false, msg : "Invalid request parameter! Please provide blogId."});
        
        if (!validators.isValidObjectId(req.params.blogId)) 
      
            return res.status(400).send({ status: false, message: 'Blog id is invalid!' });
          
        let data = req.body;
        if (!validators.isValidRequestBody(data)) 
        
            return res.status(400).send({ status: false, message: 'Invalid request body. Please provide blog details to be updated.' });
        
        let blog = await blogModel.findOne({ _id : req.params.blogId, isDeleted : false });
        if(!blog.isPublished)
        {
            data['isPublished']=true;
            data['publishedAt']=new Date();
        }
        let arrData={};
        if(data.tags!=undefined)
        {
            arrData = {tags : data.tags};
            delete data.tags;
        }
        if(data.subcategory!=undefined)
        {
            arrData['subcategory'] = data.subcategory;
            delete data.subcategory;
        }
        blog = await blogModel.findOneAndUpdate({_id : req.params.blogId,isDeleted : false},{$set : data},{new : true});
        if(Object.keys(arrData).length!=0)
        {
            blog = await blogModel.findOneAndUpdate({_id : req.params.blogId,isDeleted : false},{$addToSet : arrData},{new : true});
        }
        if(blog!=null)
        {
            res.status(200).send({status : true,data : blog});
        }
        else
        {
            res.status(404).send({status : false,msg : "Blog doesn't exist!"});
        }
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send({status : false,msg : err.message});
    }
};

const deleteBlogById = async function(req,res)
{
    try
    {
        if(req.params.blogId==undefined)
        
            res.status(400).send({status : false,msg : "Invalid request parameter! Please provide blogId."});
        
        if (!validators.isValidObjectId(req.params.blogId)) 
      
            return res.status(400).send({ status: false, message: 'Blog id is invalid!' });
        
        let blog = await blogModel.findOneAndUpdate({_id : req.params.blogId,isDeleted : false},{$set : {isDeleted : true,deletedAt : new Date()}});
        if(blog!=null)
        {
            res.status(200).send({status : true,msg : "Blog deleted successfully!"});
        }
        else
        {
            res.status(404).send({status : false,msg : "Blog doesn't exist!"});
        }
    }
    catch(err)
    {
        res.status(500).send({status : false,msg : err.message});
    }
};

const deleteBlog = async function(req,res)
{
    try
    {
        let filter={};
        if(req.query.category!=undefined)
        {
            filter['category']=req.query.category;
        }
        if(req.query.authorId!=undefined)
        {
            if(req.authorId!=req.query.authorId)res.status(401).send({status : false,msg : 'Unauthorised Access!'});
            filter['authorId']=req.query.authorId;
        }
        if(req.query.authorId==undefined)
        {
            filter['authorId']=req.authorId;
        }
        if(req.query.tags!=undefined)
        {
            let tags=JSON.parse(req.query.tags)
            filter['tags']={$in : tags};
        }
        if (req.query.subcategory!=undefined)
        {
            let subcategory=JSON.parse(req.query.subcategory)
            filter['subcategory']={$in : subcategory};
        }
        if(req.query.unpublished!=undefined)
        {
            filter['isPublished']=false;
        }
        filter['isDeleted']=false;
        let blog = await blogModel.updateMany(filter,{$set : {isDeleted : true,deletedAt : new Date()}});
        if(blog.modifiedCount!=0)
        {
            res.status(200).send({status : true,msg : "Blog deleted successfully!"});
        }
        else
        {
            res.status(404).send({status : false,msg : "Blog doesn't exist!"});
        } 
    }
    catch(err)
    {
        res.status(500).send({status : false,msg : err.message});

    }
};

module.exports={deleteBlogById,deleteBlog,updateBlog,getBlogs,createBlogs};