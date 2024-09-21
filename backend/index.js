require('dotenv').config();  // Load environment variables from .env file

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

// Use environment port if defined in the .env file, otherwise default to 5000
const port = process.env.PORT || 5000;

// Middleware
// app.use(cors({
//   origin: 'https://spoke-person-97f5.vercel.app',
//   methods: ['GET', 'POST'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
// app.use(express.json()); 
 // To parse incoming JSON requests
 app.use(express.json()); // To parse incoming JSON requests
 app.use(cors())

// Debug: Verify CORS and JSON middleware are working
console.log("CORS and JSON parsing middleware initialized.");

app.get("/", (req, res) => {
  console.log("GET request to '/' - Server is up and running.");
  res.send("Hello from the server!");
});

app.post("/check_grammar", async (req, res) => {
  const { text } = req.body;
  console.log("POST request to '/check_grammar' with text:", text);

  if (!text) {
    console.log("No text provided in the request.");
    return res.status(400).send("No text provided");
  }

  try {
    const params = new URLSearchParams({ text, language: "en-US" });
    console.log("Sending request to LanguageTool API with params:", params.toString());

    const response = await axios.post(
      "https://api.languagetool.org/v2/check",
      params,
      { 
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        timeout: 10000  // Timeout after 10 seconds if no response
      }
    );

    console.log("Received response from LanguageTool API:", response.data);

    if (response.data.matches.length === 0) {
      console.log("No corrections found.");
      return res.json({ corrections: [], correctedText: text });
    }

    let correctedText = text;
    const corrections = [];

    // Sort matches by offset to avoid messing up indices during replacements
    const sortedMatches = response.data.matches.sort((a, b) => b.offset - a.offset);

    for (const match of sortedMatches) {
      const mistake = match.context.text;
      const replacement = match.replacements[0]?.value || mistake;

      const regex = new RegExp(mistake.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      correctedText = correctedText.replace(regex, replacement);
      
      corrections.push({ mistake, correction: replacement });
    }

    console.log("Processed corrections:", corrections);
    res.json({ corrections, correctedText });
    
  } catch (error) {
    if (error.response) {
      console.error("LanguageTool API error response:", error.response.data);
      res.status(error.response.status).send("Error from LanguageTool API");
    } else if (error.request) {
      console.error("No response received from LanguageTool API:", error.request);
      res.status(500).send("No response from LanguageTool API");
    } else {
      console.error("Error setting up request to LanguageTool API:", error.message);
      res.status(500).send("Error checking grammar");
    }
  }
});

// Start the server using port from .env
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
