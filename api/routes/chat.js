const express = require('express');
const router = express.Router();
require('dotenv').config();

// Define a threshold for input size (in bytes) to switch to GPT-4
const SIZE_THRESHOLD = 70000; // Adjust this value based on your requirements

// POST route: handle chat requests from the frontend
router.post('/', async (req, res) => {
  const { messages, paper } = req.body; // Receive messages and paper content from the frontend

  // Calculate payload size
  const payloadSize = Buffer.byteLength(JSON.stringify(req.body));
  console.log('Received payload size:', payloadSize, 'bytes');

  // Determine which model to use based on the payload size
  const model = payloadSize > SIZE_THRESHOLD ? 'gpt-4o' : 'gpt-4o-mini'; // Use GPT-4 if input size is too large

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: model, // Use the determined model
        messages: [
          {
            role: 'system',
            content:
              'This GPT is designed to assist researchers by reading and analyzing a given scientific paper. It will provide expert-level answers to questions about the content in the paper. Responses should be very short and concise, and to the point, focusing on clarity and accuracy. The GPT will summarize complex information and clarify difficult concepts in a brief manner, ensuring that users can quickly grasp the material. If the information in the paper is insufficient or unclear, it will suggest potential avenues for further research or interpretation based on the existing data without making assumptions beyond what is presented.',
          },
          {
            role: 'user',
            content:
              'Here is the content of the paper: ' +
              paper +
              '. Based on the conversation history where you are the system and the user is user: ' +
              JSON.stringify(messages) +
              ', give a response to the following query: ' +
              messages[messages.length - 1].text,
          },
        ],
      }),
    });

    // Check if the response is not OK + get error details
    if (!response.ok) {
      const errorText = await response.text(); 
      console.error('Error from OpenAI:', response.status, response.statusText, errorText);
      return res.status(500).json({ error: 'Error from OpenAI: ' + response.statusText });
    }

    // Parse response from OpenAI
    const data = await response.json();

    // Send response back to frontend
    res.json({ response: data.choices[0].message.content });
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    res.status(500).json({ error: 'Failed to communicate with OpenAI' });
  }
});

module.exports = router;
