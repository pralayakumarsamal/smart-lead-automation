const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();         

app.use(cors());               
app.use(express.json());

const Lead = require("./Lead");
app.get("/leads", async (req, res) => {
  try {
    const leads = await Lead.find();
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// test route
app.post("/api/test", (req, res) => {
  const { name } = req.body;
  res.json({ message: "Hello " + name });
});

// connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});





// Run every 5 minutes




const cron = require("node-cron");


// Run every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  console.log("Running CRM Sync Job...");

  try {
    const leads = await Lead.find({
      status: "Verified",
      synced: false
    });

    for (let lead of leads) {
      console.log(
        `[CRM Sync] Sending verified lead ${lead.name} to sales Team`
      );

      lead.synced = true;
      await lead.save();
    }
  } catch (error) {
    console.error("Cron job error:", error.message);
  }
});