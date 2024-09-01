# PapeResearch, an application built for the 'Paper of the Future' final year project at Imperial College London.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)

## Project Overview

This project is designed to improve the consumption of academic papers by creating an interactive reading interface formatted in HTML, which features an AI chatbot for research assistance and a dynamic figure panel. It aims to provide researchers and academics with a seamless reading experience, making complex scientific information more engaging and manageable.

## Features

- **AI Research Assistant**: Provides expert-level answers and summaries of paper content integrated into the reading interface.
- **Dynamic Figure Panel**: Figures are initially hidden from the main content of the paper and are instead dynamically displayed in a side panel as the user scrolls through the paper.
- **Interactive Figure Captions**: Click figure captions in the main paper content to reveal figures that are initially hidden to optimise space.
- **Figure Pinning**: Pin important figures for quick access while reading.
- **Table of Contents Sidebar**: Quickly navigate through sections of the paper, and collapse the sidebar when it's not required to keep focus on the paper.

## Tech Stack

- **Frontend**: React.js, HTML, CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB

## Setup Instructions

Follow these instructions to set up the project:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/conan-gk/PapeResearch.git
   cd PapeResearch
2. **Install Dependencies for client directory**
   ```bash
   cd client
   yarn install
3. **Install Dependencies for api directory**
   ```bash
   cd api
   yarn install
4. **Add environment variable for OpenAI api key**
   ```bash
   in api directory, create a .env file and add the following: OPENAI_API_KEY= <api key/email for access to my key>
   yarn add dotenv
5. **Run Backend Server**
   ```bash
   cd api
   yarn start
4. **Run the Frontend**
   ```bash
   cd client
   yarn start
   Open http://localhost:3000 in your web browser.
  






