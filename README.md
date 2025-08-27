
# SecReq


- offser 
    you set a goal for them. then they can get their money back later. 
- if we can publicly use you as a reference and put you on the site with a quote, it's free? but like forever? there would have to be ongoign stuff.


AI-powered security questionnaire platform that helps organizations efficiently respond to security assessments using intelligent document analysis and automated answer generation.


# later ideas 
- collab 
- leave notes in cells / resolve them 
- allwo customer to send our url with the filled out questionnaire so the RECIEVER can just chat with the ai about the policies and document. 
- 


## Features

### Core Platform
• **Multi-tenant Architecture** with organization-based RBAC
• **Supabase Backend** with PostgreSQL and vector search
• **AI-Powered Answers** using Google Gemini and RAG pipeline
• **Real-time Collaboration** with chat interface
• **Version Control** for all answers with full audit trail

### Questionnaire Management
• **Smart Upload** - CSV/Excel with multi-sheet detection
• **Field Mapping** - Intelligent column-to-field mapping
• **Excel-like Interface** - Familiar grid with keyboard navigation
• **Bulk Operations** - Status updates and approvals
• **Export Options** - Original format + citations + memo

### AI & Knowledge Management
• **Dataset Management** - Organized document collections
• **Vector Search** - Semantic document and Q&A retrieval  
• **Confidence Scoring** - AI reliability indicators
• **Citation Tracking** - Full source attribution
• **QA Library** - Reusable approved answers

## Quick Start

1. **Environment Setup**
```bash
cp .env.local.example .env.local
# Configure your environment variables
```

2. **Install Dependencies**
```bash
npm install
```

3. **Database Setup**
Run the SQL schema in your Supabase project:
```bash
# Execute supabase-schema.sql in your Supabase SQL editor
```

4. **Development**
```bash
npm run dev
```

## Environment Variables

Create `.env.local` with:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google AI
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Architecture

```
src/
├── app/                          # Next.js App Router
│   ├── auth/                    # Authentication pages
│   ├── dashboard/               # Main dashboard
│   ├── questionnaires/          # Questionnaire management
│   └── datasets/                # Dataset management
├── components/
│   ├── questionnaire/           # Upload & mapping components
│   ├── workshop/                # Answer workshop UI
│   ├── dataset/                 # Dataset management
│   └── ui/                      # Reusable UI components
├── lib/
│   ├── supabase.js             # Database client
│   ├── ai.js                   # AI model setup
│   └── rag.js                  # RAG pipeline
└── hooks/
    └── use-auth.js             # Authentication hooks
```

## Key Workflows

### 1. Questionnaire Creation
1. Upload CSV/Excel file
2. Map columns to system fields
3. Select relevant datasets
4. AI processes and generates initial answers

### 2. Answer Workshop
1. Review AI-generated answers
2. Edit and approve responses
3. Chat with AI for specific questions
4. View citations and sources
5. Export completed questionnaire

### 3. Dataset Management
1. Create organized document collections
2. Upload policy docs and evidence
3. AI processes and indexes content
4. Use in questionnaire answer generation

## Database Schema

The platform uses Supabase with:
- **Organizations** - Multi-tenant structure
- **Questionnaires** - Main assessment entities
- **Items** - Individual questions/answers
- **Datasets** - Document collections
- **QA Library** - Reusable answers
- **Vector Storage** - Semantic search capabilities

## AI Pipeline

1. **Document Processing** - Extract and chunk content
2. **Embedding Generation** - Create vector representations
3. **Semantic Search** - Find relevant context
4. **Answer Generation** - AI creates responses with citations
5. **Confidence Scoring** - Rate answer reliability

## Development Notes

- Built with Next.js 15 and React 19
- Supabase for backend and vector storage
- Google Gemini for AI generation
- Tailwind CSS 4 with modern design
- Full TypeScript support (coming soon)
