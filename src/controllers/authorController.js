const authorModel = require("../models/authorModel");
const Validators = require('../validators/validator');
const jwt = require('jsonwebtoken');

const createAuthor = async function(req,res) 
{
    try
    {
        let requestBody=req.body;

        if (!Validators.isValidRequestBody(requestBody))
            
            return res.status(400).send({ status: false, message: 'Invalid request body. Please provide author details.' })

        if (!Validators.isValidField(requestBody.fname))
            
            return res.status(400).send({ status: false, message: 'First name is required.' });

        if (!Validators.isValidField(requestBody.lname))
            
            return res.status(400).send({ status: false, message: 'Last name is required.' });

        if (!Validators.isValidField(requestBody.title))
            
            return res.status(400).send({ status: false, message: 'Title is required.' });

        if(!Validators.isValidTitle(requestBody.title))

            return res.status(400).send({ status: false, message: 'Title should be either Mr, Mrs, or Miss.' });

        if (!Validators.isValidField(requestBody.email)) 
        
            return res.status(400).send({ status: false, message: 'E-Mail is required.' });
        
        if (!Validators.isValidField(requestBody.password)) 
        
            return res.status(400).send({ status: false, message: 'Password is required.' });
        
        if (!Validators.isValidEmail(requestBody.email)) 
        
            return res.status(400).send({ status: false, msg: 'Enter a valid E-Mail.' });
        
        let emailIsAlreadyInUse = await authorModel.findOne({email : requestBody.email});
        if(emailIsAlreadyInUse)
    
                return res.status(400).send({ status: false, msg: 'E-Mail has already been registered.' });
            
        let data = req.body;
        let created = await authorModel.create(data);
        res.status(201).send({status: true, data: created});
    }
    catch(err)
    {
        res.status(500).send({status: false, msg: err.message});
    }    
};

const loginAuthor = async function (req, res) 
{
    try 
    {
        const requestBody = req.body;
        
        if (!Validators.isValidRequestBody(requestBody)) 
        
            return res.status(400).send({ status: false, message: 'Invalid request body. Please provide login details.' });
        
        if (!Validators.isValidField(requestBody.email)) 
        
            return res.status(400).send({ status: false, message: 'E-Mail is required.' });
        
        if (!Validators.isValidField(requestBody.password)) 
        
            return res.status(400).send({ status: false, message: 'Password is required.' });
        
        if (!Validators.isValidEmail(requestBody.email)) 
        
            return res.status(400).send({ status: false, msg: 'Enter a valid E-Mail.' });
        
        const author = await authorModel.findOne({ email: requestBody.email, password: requestBody.password });
        if (author==null) 
            
            return res.status(400).send({ status: false, msg: "Invalid login credentials!" });
            
        let payload = { authorId : author._id };
        let token = jwt.sign(payload, 'projectOne');
        res.header('x-api-key', token);
        res.status(201).send({ status: true, msg: "Login Successfull!", token: token});
    } 
    catch (error) 
    {
        res.status(500).send({ status: false, error: error.message });
    }
};

module.exports={createAuthor,loginAuthor};