import express from "express";
import cors from "cors";

const port = process.env.PORT || 8080;
const app = express();

// middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());



app.get("/", (req, res) => {
    res.send("My fs project");
  });
  
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });



