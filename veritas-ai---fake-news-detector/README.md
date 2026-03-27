### Fake News Analyzer
An AI-driven web application developed for Hackathonix 2.0 that analyzes and evaluates the credibility of online news articles using advanced AI technology.

# Features
Analyze news using URL or text input
Generates credibility score
Displays status (Real / Fake / Suspicious)
AI-powered explanation of results
Stores analyzed data in MongoDB Atlas
Fast and user-friendly interface

# Tech Stack
Frontend:React.js
Backend:Node.js, Express.js
AI API:Google Gemini API
Database: MongoDB Atlas

# Purpose
This project helps users identify fake or misleading news and promotes safe and reliable information consumption using AI-based analysis.

# Output Example
Status: Fake / Real / Suspicious
Credibility Score: 75%
Explanation: AI-generated reasoning based on content analysis


⚙️ Installation & Setup
# Clone the repository
git clone https://github.com/ByteNewb573/fake-news-analyzer.git

# Navigate to project folder
cd veritas-ai---fake news-detector

# Install dependencies

### Frontend

* react-router-dom
* axios
* tailwindcss
* postcss
* autoprefixer
* react-icons

### Backend

* express
* mongoose
* cors
* dotenv
* nodemon (dev dependency)


# Start the development server
npm start
Project Structure

veritas-ai-fake-news-detector/
│
├── src/
│   ├── pages/
│   │   ├── About.tsx        # About page
│   │   ├── Analyzer.tsx     # Main AI analysis page
│   │   ├── History.tsx      # Previously analyzed news
│   │   └── Home.tsx         # Landing page
│   │
│   ├── services/
│   │   └── ai.ts            # Gemini API integration
│   │
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Tailwind CSS styles
│
├── index.html               # Root HTML file
├── server.ts                # Backend server (Node/Express)
├── metadata.json            # Project metadata
├── package.json             # Project dependencies
├── package-lock.json        # Dependency lock file
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── README.md                # Project documentation
│
└── screenshots/             # (Optional) App images for README


# Future Enhancements
Deploy live version (Vercel/Render)
Improve AI accuracy with better prompts
User authentication system
News history tracking dashboard

# Author
Karuna Deshmukh
