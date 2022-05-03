const jwt = require('jsonwebtoken');
const authorModel = require('../models/authorModel');
const blogModel = require("../models/blogModel");

const authenticate = async function(req,res,next)
{
    try 
    {
        let token = req.headers["x-api-key"];
        if (!token) return res.status(400).send({status: false, msg: "The Request is missing a mandatory header."});
        let decodedToken = jwt.verify(token,"projectOne");
        if (!decodedToken) return res.status(401).send({status: false, msg: "Invalid token"});
        req.authorId=decodedToken.authorId;
        let auth=await authorModel.findById(decodedToken.authorId);
        if(auth!=null) next();
        else return res.status(401).send({status : false,msg : "Author not logged in!"});
    } 
    catch(err)
    {
        res.status(500).send({status : false,msg: err.message});
    }
};

const authorise = async function(req,res,next)
{
    try
    {
        let blogId = req.params.blogId
        let blog = await blogModel.findOne({_id : blogId},{authorId : 1});
        if(req.authorId==blog.authorId)
        {
            next();
        }
        else
            res.status(403).send({status : false,msg : "Unauthorised Access!"});
    }
    catch(err)
    {
        res.status(500).send({status : false,msg : err.messsage});
    }
};

module.exports.authenticate = authenticate
module.exports.authorise = authorise