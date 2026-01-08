# Human-Centered AI Content Moderation Dashboard

> AI assists, Humans decide — Putting people in control of content moderation decisions

[![Next.js](https://img.shields.io/badge/Next.js-15.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 Problem Statement

Fully automated content moderation systems face significant challenges:

- ❌ **False Positives**: Incorrectly flag harmless content
- ❌ **False Negatives**: Miss harmful content
- ❌ **Censorship**: Suppress free speech
- ❌ **Lack of Accountability**: Remove human judgment from sensitive decisions

## 🎯 Project Goal

Build a **Human-Centered AI** content moderation system where:

- ✅ AI only assists — never makes final decisions
- ✅ Humans make all final moderation decisions
- ✅ AI shows confidence scores and reasoning
- ✅ Ethical risks are visible and managed
- ✅ All decisions are logged and traceable

## 👥 User Roles

### 👤 Content Creator
- Posts text content through submission form
- May be incorrectly flagged by AI (false positives)
- Content is protected until human review

### 👩‍⚖️ Human Moderator (Primary User)
- Reviews AI-flagged content
- Makes final moderation decisions
- Overrides AI when necessary
- Provides feedback for model improvement

## 🏗️ System Architecture

```
User Submits Content
         ↓
    AI Analyzes
         ↓
    AI Classifies & Scores
         ↓
    Confidence Check
         ↓
    Flagged? (if confidence > 0.7)
         ↓
    Human Reviews
         ↓
    Final Decision
         ↓
    Feedback Logged
         ↓
    Ethics Metrics Updated
```

## ✨ Core Features

### 🔹 Feature 1: Content Submission Module
- **Purpose**: Simulate real social media or forum posts
- **What it does**:
  - Allows users to submit text content
  - Stores content for moderation
  - Provides example content for testing
- **UI Elements**:
  - Text input box
  - Author name field (optional)
  - "Submit Content" button
  - Real-time analysis feedback

### 🔹 Feature 2: AI Content Classification Engine
- **Purpose**: Automatically analyze content using LLM
- **AI Tasks**: Classify content into:
  - `hate_speech` - Promotes hatred/discrimination
  - `harassment` - Targets individuals with abuse
  - `violence` - Promotes/incites violence
  - `safe` - Harmless, appropriate content
- **Output**:
  - Predicted category
  - Probability score (confidence 0-1)
  - Explanation with keywords

**Example Output**:
```
Prediction: Hate Speech
Confidence: 0.82
Explanation: Content contains discriminatory language targeting ethnic groups
```

### 🔹 Feature 3: AI Flagging Logic
- **Purpose**: Decide what needs human review
- **Rules**:
  - If confidence > 0.7 → flag for human review
  - If confidence < 0.7 → auto-approve but log
- **Why this matters**:
  - Prevents over-blocking
  - Shows restraint
  - Protects free speech

### 🔹 Feature 4: Human Review Dashboard (CORE FEATURE)
- **Purpose**: Put humans in control
- **Dashboard Displays**:
  - Original content with keyword highlighting
  - AI-predicted label
  - Confidence score with visual indicator
  - Explanation for flagging
- **Human Actions**:
  - ✅ Approve content (override AI if needed)
  - ❌ Remove content
  - 🔁 Override AI decision with reason

### 🔹 Feature 5: AI Explanation Panel
- **Purpose**: Help humans understand AI reasoning
- **Explanation Options**:
  - Highlighted keywords that triggered flag
  - Short text explanation
  - Example: "This content was flagged due to use of abusive language."

### 🔹 Feature 6: Confidence & Uncertainty Indicators
- **Purpose**: Prevent blind trust in AI
- **Display**:
  - Confidence bar (low / medium / high)
  - Warning text for low confidence
  - Color-coded indicators (red/yellow/green)

### 🔹 Feature 7: Human Feedback Logging
- **Purpose**: Learn from human decisions
- **What is stored**:
  - AI decision (label, confidence)
  - Human decision (approve/remove/override)
  - Reason for override
  - Reviewer name
  - Timestamp
- **Why this matters**:
  - Enables model improvement
  - Shows HITL (Human-in-the-Loop) design
  - Provides audit trail

### 🔹 Feature 8: Ethics & Fairness Dashboard
- **Purpose**: Make ethical risks visible
- **Metrics**:
  - False positive rate (safe content incorrectly flagged)
  - False negative rate (harmful content missed)
  - Override frequency (humans disagreeing with AI)
  - Total content reviewed
- **Visuals**:
  - Progress bars for each metric
  - Summary statistics
  - Ethical safeguards checklist

## ⚖️ Ethical Design Considerations

### ✅ False Positives
- **Problem**: Innocent speech flagged as harmful
- **Solution**: Human review prevents censorship
- **Implementation**: Content is only removed after human confirmation

### ✗ Free Speech Protection
- **Problem**: AI auto-deleting content
- **Solution**: AI does not auto-delete
- **Implementation**: Humans decide final outcome

### ✅ Accountability
- **Problem**: Untraceable decisions
- **Solution**: Every decision is logged
- **Implementation**: Complete audit trail for all AI and human decisions

### ✅ Transparency
- **Problem**: Black-box AI decisions
- **Solution**: AI reasoning is visible
- **Implementation**: Confidence scores and explanations always shown

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (Radix UI)
- **State Management**: React hooks
- **Charts**: Recharts (for future enhancements)

### Backend
- **Runtime**: Node.js with Bun
- **AI Engine**: z-ai-web-dev-sdk (LLM)
- **Database**: SQLite with Prisma ORM
- **API**: Next.js API Routes

### AI Capabilities
- **Content Classification**: Large Language Model
- **Natural Language Understanding**: AI-powered text analysis
- **Explainability**: Keyword extraction and reasoning

## 📁 Project Structure

```
human-ai-content-moderation-dashboard/
├── prisma/
│   └── schema.prisma              # Database schema
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai/
│   │   │   │   └── analyze/       # AI classification endpoint
│   │   │   ├── content/
│   │   │   │   ├── submit/        # Content submission
│   │   │   │   ├── flagged/       # Get flagged posts
│   │   │   │   └── review/        # Human review actions
│   │   │   └── ethics/
│   │   │       └── metrics/       # Ethics dashboard data
│   │   ├── page.tsx               # Main dashboard UI
│   │   ├── layout.tsx             # Root layout
│   │   └── globals.css            # Global styles
│   ├── components/
│   │   └── ui/                    # shadcn/ui components
│   └── lib/
│       ├── db.ts                  # Prisma client
│       └── utils.ts               # Utility functions
├── public/                        # Static assets
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── tailwind.config.ts             # Tailwind config
├── next.config.ts                 # Next.js config
└── README.md                      # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/human-ai-content-moderation-dashboard.git
cd human-ai-content-moderation-dashboard
```

2. **Install dependencies**
```bash
# Using bun (recommended)
bun install

# Or using npm
npm install

# Or using yarn
yarn install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and configure:
```
DATABASE_URL="file:./dev.db"
```

4. **Initialize the database**
```bash
bun run db:push
```

5. **Run the development server**
```bash
bun run dev
```

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### 1. Submit Content for Analysis

1. Go to the **Submit Content** tab
2. Enter your content in the text area
3. (Optional) Add your name
4. Click **Submit for Analysis**
5. View the AI's classification and confidence score

### 2. Review Flagged Content

1. Go to the **Review Flagged** tab
2. Browse through AI-flagged content
3. Review the AI's reasoning and confidence
4. Take one of these actions:
   - **Approve**: Allow the content to remain
   - **Remove**: Delete the harmful content
   - **Override AI**: Disagree with AI and provide reason

### 3. Monitor Ethics Metrics

1. Go to the **Ethics Dashboard** tab
2. Review:
   - False positive rate (lower is better)
   - False negative rate (lower is better)
   - Override frequency (humans correcting AI)
   - Total content reviewed
3. Use metrics to identify areas for improvement

## 🔧 API Documentation

### POST /api/content/submit
Submit new content for analysis.

**Request Body**:
```json
{
  "content": "Your text content here",
  "authorName": "Optional author name"
}
```

**Response**:
```json
{
  "post": {
    "id": "cm123abc",
    "content": "Your text content here",
    "authorName": "Optional author name",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### POST /api/ai/analyze
Analyze content using AI classification.

**Request Body**:
```json
{
  "postId": "cm123abc"
}
```

**Response**:
```json
{
  "analysis": {
    "id": "cm456def",
    "postId": "cm123abc",
    "predictedLabel": "hate_speech",
    "confidence": 0.82,
    "explanation": "Content contains discriminatory language",
    "flagged": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### GET /api/content/flagged
Get all flagged content awaiting human review.

**Response**:
```json
{
  "posts": [
    {
      "post": { "id": "cm123abc", ... },
      "analysis": { "predictedLabel": "hate_speech", ... }
    }
  ]
}
```

### POST /api/content/review
Submit human review decision.

**Request Body**:
```json
{
  "postId": "cm123abc",
  "action": "approve|remove|override",
  "overrideReason": "Optional reason for override",
  "reviewerName": "Moderator"
}
```

**Response**:
```json
{
  "review": {
    "id": "cm789ghi",
    "postId": "cm123abc",
    "action": "approve",
    "finalLabel": "safe",
    "reviewedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### GET /api/ethics/metrics
Get ethics and fairness metrics.

**Response**:
```json
{
  "metrics": {
    "falsePositiveRate": 0.15,
    "falseNegativeRate": 0.05,
    "overrideFrequency": 0.25,
    "totalReviewed": 42
  }
}
```

## 🎨 UI Components

The dashboard uses shadcn/ui components built on Radix UI:

- **Cards**: Content containers
- **Badges**: Status indicators
- **Progress Bars**: Confidence levels
- **Alerts**: Warnings and notifications
- **Tabs**: Navigation between views
- **Buttons**: Action triggers
- **Textarea**: Content input
- **Input**: Author name field

## 🧪 Testing

### Example Content for Testing

The application includes example content to test different scenarios:

1. **Hate Speech**: Content promoting hatred or discrimination
2. **Harassment**: Abusive language targeting individuals
3. **Violence**: Content inciting physical violence
4. **Safe - Normal Conversation**: Harmless everyday content
5. **Safe - Political Speech**: Protected political discourse

Click on any example to load it into the submission form.

## 🔒 Security Considerations

- Human-in-the-loop: No content is removed without human approval
- Audit trail: All decisions are logged and traceable
- Confidence thresholds: Low-confidence AI predictions require extra caution
- Rate limiting: Consider implementing for production (not included in demo)
- Authentication: Consider implementing role-based access (not included in demo)

## 📊 Limitations

1. **AI Model**: Uses LLM for classification, which may not be as accurate as specialized models
2. **False Negatives**: The system may miss some harmful content
3. **Bias**: AI models may have inherent biases from training data
4. **Context**: AI may struggle with sarcasm, irony, or cultural nuances
5. **Scalability**: Human review doesn't scale to millions of posts
6. **Ground Truth**: False negative rate calculation is simplified

## 🚀 Future Enhancements

### Optional Advanced Features

- [ ] **Multi-language moderation**: Support content in multiple languages
- [ ] **Active learning**: AI learns from human feedback over time
- [ ] **Role-based access control**: Different permissions for different user types
- [ ] **Dataset bias analysis**: Identify and quantify AI biases
- [ ] **Sentiment analysis**: Add emotional context to classifications
- [ ] **Image/video moderation**: Extend beyond text content
- [ ] **Appeal process**: Allow users to appeal moderation decisions
- [ ] **Real-time notifications**: Alert moderators of new flagged content
- [ ] **Bulk review**: Review multiple items at once
- [ ] **Export reports**: Generate compliance and audit reports

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- AI powered by [z-ai-web-dev-sdk](https://github.com/z-ai-web-dev-sdk)
- Icons from [Lucide](https://lucide.dev/)

---

## 🌍 DEPLOYMENT ON GITHUB

### Step 1: Prepare Your Repository

1. **Initialize Git** (if not already done):
```bash
git init
```

2. **Update .gitignore**:
Ensure `.env` and `node_modules` are in your `.gitignore`:
```
# Environment variables
.env
.env.local
.env.development.local

# Dependencies
node_modules
/.pnp
.pnp.js

# Database
*.db
*.db-journal
prisma/*.db
prisma/*.db-journal

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
dev.log
server.log

# Next.js
.next/
out/
build/
dist/

# Testing
coverage/

# Production
.vercel
.netlify

# Misc
.DS_Store
*.pem
```

3. **Commit your changes**:
```bash
git add .
git commit -m "Initial commit: Human-Centered AI Content Moderation Dashboard"
```

### Step 2: Create GitHub Repository

1. Go to [github.com](https://github.com/new)
2. Create a new repository named: `human-ai-content-moderation-dashboard`
3. **DO NOT** initialize with README, .gitignore, or license (you already have them)
4. Click "Create repository"

### Step 3: Push to GitHub

```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/human-ai-content-moderation-dashboard.git

# Change branch name to main
git branch -M main

# Push to GitHub
git push -u origin main
```

### Step 4: Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications:

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure build settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `bun run build` (or `npm run build`)
   - **Output Directory**: `.next`
5. Add environment variables:
   - `DATABASE_URL`: Use a production database (see Step 5)
6. Click "Deploy"

### Step 5: Set Up Production Database

For production, you need a proper database. Options:

#### Option A: Vercel Postgres (Recommended)
1. In your Vercel project, go to "Storage" → "Create Database"
2. Select "Postgres"
3. Vercel will provide a `DATABASE_URL` in your project settings
4. Update your `.env` in Vercel with this URL
5. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  # Changed from "sqlite"
  url      = env("DATABASE_URL")
}
```

#### Option B: Supabase
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Get database connection string
4. Update environment variable in Vercel
5. Update Prisma schema to use PostgreSQL

#### Option C: Railway / Render / Other
1. Create account on your preferred platform
2. Create PostgreSQL instance
3. Get connection string
4. Update environment variables

### Step 6: Run Database Migrations

After setting up your production database:

```bash
# Generate Prisma client
bun run db:generate

# Push schema to production database
bun run db:push
```

### Step 7: Configure Your Domain (Optional)

1. In Vercel project settings → "Domains"
2. Add your custom domain
3. Update DNS records as instructed

### Step 8: Monitor and Scale

1. Set up Vercel Analytics for performance monitoring
2. Configure error tracking (e.g., Sentry)
3. Set up logging
4. Monitor API usage and costs

### Alternative: Deploy to Netlify

If you prefer Netlify:

1. Go to [netlify.com](https://netlify.com)
2. "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
5. Add environment variables
6. Deploy

### Alternative: Self-Host

To self-host on your own server:

1. Build the application:
```bash
bun run build
```

2. Start the production server:
```bash
bun run start
```

3. Use a reverse proxy (nginx, Apache, Caddy):
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. Set up SSL with Let's Encrypt (certbot)

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

**Remember**: AI assists, Humans decide — This is the core philosophy of human-centered content moderation.
