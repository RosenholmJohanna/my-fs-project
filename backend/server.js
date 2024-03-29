import express from "express";
import cors from "cors";
import bcrypt from 'bcrypt';
import mongoose from "mongoose";
import crypto from "crypto";
//import { UserSchema } from "./models/user";


// move user schema here due module can't be resolved.. 
export const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  motivation: {
    type: Number,
    default: 1
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlenght: 3
  },
  createdAt: {
    type: Date,
    default: () => new Date() 
  },
  roles: {
    type: String,
    default: 'user'
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString("hex")
  },
  savedQuestion: [{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
    ref: 'Question'
  }]
});

const User = mongoose.model("User", UserSchema);

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/my-fs-project";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log('Connected to the Database successfully')
}); mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

// middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("My fs project");
  });


// USER LOGIN 
app.post("/login", async (req, res) => {
  const { username, password} = req.body;
  try {
    const user = await User.findOne({username});
    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(200).json({
        success: true,
        response: {
          username: user.username,
          id: user._id,
          accessToken: user.accessToken, // remove -- preview? 
          savedQuestion: user.savedQuestion
        }
      });
    } else {
      res.status(400).json({
        success: false,
        response: "Credentials didn't match"
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error
    });
  }
});

// USER REGISTRATION 
app.post("/register",  async (req, res) => {
  const { username, password } = req.body;
  try {
    const salt = bcrypt.genSaltSync();
    if (password.length < 3) {
      res.status(400).json({
        success: false,
        response: "Password must be at least 3 characters long"
      });
    } else {
      const newUser = await new User({username: username, password: bcrypt.hashSync(password, salt)}).save();
      console.log(newUser)
      res.status(201).json({
        success: true,
        response: {
          username: newUser.username,
          accessToken: newUser.accessToken,
          //id: newUser._id
        }
      });
    }
  } catch(error) {
      res.status(400).json({
        success: false,
        response: error
      });
  }
});

//AUTHORIZATION USER
const authenticateUser = async (req, res, next) => {
  const accessToken = req.header("Authorization");
  try {
    const user = await User.findOne({accessToken: accessToken});
    if (user) {
      next();
    } else {
      res.status(401).json({
        response: "Please log in",
        success: false
      })
    }
  } catch (error) {
    res.status(400).json({
      response: error,
      success: false
    })
  }
}

// // GET SINGLE USER's PROFILE
//app.get('/users/:id', authenticateUser)
app.get('/users/:id', async (req, res) => {
  const { id } = req.params
  try {    
    if (id) {
      const userPage = await User.findById(id)
      res.status(200).json({
        success: true,
        username: userPage.username,
        id: userPage.id,
        motivation: userPage.motivation,

      })
    } else {
      res.status(404).json({ error: 'Not found' })
    }
  } catch (error) {
    res.status(400).json({ error: 'Invalid request' })
  }
})


app.get("/", (req, res) => {
  res.send("My fullstack project");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});