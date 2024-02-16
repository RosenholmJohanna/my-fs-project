import express from "express";
import cors from "cors";
import bcrypt from 'bcrypt';
import mongoose from "mongoose";
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

//

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
          accessToken: user.accessToken,
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

  
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
