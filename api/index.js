const jwt =require('jsonwebtoken');

const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User');
const Post=require('./models/Post');
const bcrypt = require('bcrypt');
const app = express();


const formData = require('express-form-data');
const cookieParser = require('cookie-parser');

const salt = bcrypt.genSaltSync(10);
const secret = 'addkmfrkr44fr3f';



app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser());


mongoose.connect('mongodb+srv://toyeshshende02:Tonyshende3000@cluster0.xtruzhg.mongodb.net/?retryWrites=true&w=majority');


app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.findOne({ username });
    if (!userDoc) {
      return res.status(400).json('User not found');
    }
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      const token = jwt.sign({ username, id: userDoc._id }, secret);
      res.cookie
      ('token', token, { httpOnly: true }).json({
        id: userDoc._id,
        username,
      });
    } else {
      res.status(400).json('Wrong credentials');
    }
  } catch (err) {
    console.log(err);
    res.status(500).json('Internal Server Error');
  }
});

app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json('Unauthorized');
  }
  jwt.verify(token, secret, (err, info) => {
    if (err) {
      return res.status(401).json('Invalid token');
    }
    res.json(info);
  });
});

app.post('/logout', (req, res) => {
  res.clearCookie('token').json('Logged out successfully');
  
});
app.post('/post', async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, async (err, info) => {
    if (err) {
      return res.status(401).json('Invalid token');
    }

    
    const { title, summary, content, imageUrl } = req.body; 

    if (!title || !summary || !content ||! imageUrl) {
      return res.status(400).json('Title, summary, and content are required');
    }

    if (! imageUrl) {
      return res.status(400).json('file is required');
    }

    try {
  
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover:imageUrl,
        author: info.id,
      });

      res.json(postDoc);
    } catch (error) {
      console.error(error);
      res.status(500).json('Internal Server Error');
    }
  });
});


app.put('/post',formData.parse(), async(req, res) => {
  
  const { token } = req.cookies;
   jwt.verify(token, secret, {},async (err, info) => {
    if(err) {
      return res.status(401).json('Invalid token');
    }
    const{id,title,summary,content,imageUrl}=req.body;
    const postDoc=await Post.findByIdAndUpdate(id);
    const isAuthor=JSON.stringify(postDoc.author)===JSON.stringify(info.id);
    if(!isAuthor){
      return res.status(400).json('you are not the author');
    }
    await postDoc.updateOne({
      title,
      summary,
      content,
      cover:imageUrl ? imageUrl :Post.cover,
     
  });
       res.json(postDoc);
  });
});
app.get('/post', async (req, res) => {
  res.json(
    await Post.find()
      .populate('author', ['username'])
      .sort({ createdAt: -1 })
      .limit(20)
  );
});
  app.get('/post/:id', async (req, res) => {
    const { id } = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
  });
  
  
app.listen(4000);
