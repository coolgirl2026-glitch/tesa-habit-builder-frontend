# TESA Habit Builder (Aspire)

A modern, AI-powered habit program builder that helps organizations create personalized habit development programs for their employees based on role-specific challenges and competency gaps.

## Overview

TESA Habit Builder guides users through a progressive flow to:
1. Define a problem statement related to their role
2. Select relevant competencies (AI-generated based on context)
3. Set expected outcomes
4. Generate a customized habit program with actionable tasks
5. Select and save habits to include in their program

## Features

### Company & Role Management
- Create and manage multiple company profiles with industry and description
- Add multiple roles per company
- Data persists across sessions using localStorage

### AI-Powered Generation
- **Problem Statement Suggestions**: Contextual chips based on company/role
- **Competency Identification**: AI analyzes role, problem, and industry to suggest relevant competencies
- **Outcome Suggestions**: Smart suggestions for expected outcomes
- **Habit Program Generation**: Real-time streaming of personalized habit programs

### Progressive Flow
- Step-by-step guided experience with visual progress indicator
- Smooth auto-scrolling between sections
- Disabled state management to prevent editing completed steps

### Program Management
- View generated program details (name, description, objectives)
- Select 2-5 habits from generated tasks
- Copy program data to clipboard with one click
- Save and track created programs

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **TypeScript** | Type Safety |
| **Vite** | Build Tool & Dev Server |
| **Tailwind CSS** | Styling |
| **shadcn/ui** | UI Components |
| **Radix UI** | Accessible Primitives |
| **React Router** | Routing |
| **React Query** | Server State Management |
| **Sonner** | Toast Notifications |
| **Lucide React** | Icons |

## Project Structure

```
src/
├── components/
│   ├── tesa/                    # Main application components
│   │   ├── Sidebar.tsx          # Navigation sidebar
│   │   ├── MainContent.tsx      # Main content area
│   │   ├── Logo.tsx             # Application logo
│   │   ├── ProgressiveFlow.tsx  # Step-by-step flow orchestrator
│   │   ├── CompanyProfilesModal.tsx  # Company management modal
│   │   ├── ProgramChips.tsx     # Program display chips
│   │   ├── ProgramViewer.tsx    # Program details viewer
│   │   └── steps/               # Individual flow steps
│   │       ├── ProblemStatementSection.tsx
│   │       ├── CompetencySelectionSection.tsx
│   │       ├── OutcomeSection.tsx
│   │       ├── GeneratedProgramSection.tsx
│   │       ├── HabitSelectionSection.tsx
│   │       ├── ProgramSavedSection.tsx
│   │       └── StepProgressIndicator.tsx
│   └── ui/                      # shadcn/ui components
├── hooks/
│   └── useTesa.ts               # Main state management hook
├── types/
│   └── tesa.ts                  # TypeScript interfaces
├── pages/
│   ├── Index.tsx                # Main page
│   └── NotFound.tsx             # 404 page
├── lib/
│   └── utils.ts                 # Utility functions
└── integrations/
    └── supabase/                # Supabase client (optional)
```

## API Integrations

### 1. Generate Competencies
**Endpoint:** `POST https://apicuration.aspirenow.in/v2/generate-competency`

Generates role-specific competencies based on company context and problem statement.

```json
// Request
{
  "companyIndustry": "string",
  "companyDescription": "string",
  "employeeRole": "string",
  "problemStatement": "string"
}

// Response
{
  "status": true,
  "data": {
    "competencies": ["string", "string", ...]
  }
}
```

### 2. Generate Problem Chips
**Endpoint:** `POST https://apicuration.aspirenow.in/v2/generate-problem-chips`

Generates contextual problem statement suggestions.

```json
// Request
{
  "companyIndustry": "string",
  "companyDescription": "string",
  "employeeRole": "string"
}

// Response
{
  "status": true,
  "data": {
    "chips": [
      {
        "chipText": "string",
        "problemStatement": "string"
      }
    ]
  }
}
```

### 3. Generate Outcome Chips
**Endpoint:** `POST https://apicuration.aspirenow.in/v2/generate-outcome-chips`

Generates outcome suggestions based on selected competency.

```json
// Request
{
  "companyIndustry": "string",
  "companyDescription": "string",
  "employeeRole": "string",
  "problemStatement": "string",
  "competency": "string"
}

// Response
{
  "status": true,
  "data": {
    "chips": [
      {
        "chipText": "string",
        "outcomeStatement": "string"
      }
    ]
  }
}
```

### 4. Generate Habit Program (Streaming)
**Endpoint:** `POST http://localhost:3900/v2/generate-habit-program-v2`

Streams habit program generation using Server-Sent Events (SSE).

```json
// Request
{
  "companyIndustry": "string",
  "companyDescription": "string",
  "employeeRole": "string",
  "problemStatement": "string",
  "competency": "string",
  "outcome": "string"
}

// SSE Response Chunks
{ "type": "chunk", "content": "...", "section": "programName" }
{ "type": "chunk", "content": "...", "section": "programDescription" }
{ "type": "chunk", "content": "...", "section": "habitTasks", "taskIndex": 0, "field": "taskName" }
{ "type": "done", "status": true, "data": { "habitProgram": {...} } }
```

## Data Models

### CompanyProfile
```typescript
interface CompanyProfile {
  id: string;
  user_id: string;
  company_name: string;
  industry: string;
  description: string;
  created_at: string;
  updated_at: string;
}
```

### Role
```typescript
interface Role {
  id: string;
  user_id: string;
  company_id: string;
  role_name: string;
  created_at: string;
  updated_at: string;
}
```

### Program
```typescript
interface Program {
  id: string;
  role_id: string;
  user_id: string;
  problem_statement: string;
  competency: string;
  outcome: string;
  program_name: string;
  program_description: string;
  program_objectives: string[];
  selected_habits: HabitTask[];
  created_at: string;
}
```

### HabitTask
```typescript
interface HabitTask {
  title: string;
  description: string;
  duration: number;
}
```

## Local Storage

The application uses localStorage for data persistence:

| Key | Description |
|-----|-------------|
| `tesa_company_profiles` | Array of company profiles |
| `tesa_roles` | Array of roles |
| `tesa_programs` | Array of saved programs |
| `tesa_selected_profile_id` | Currently selected company ID |
| `tesa_selected_role_id` | Currently selected role ID |
| `tesa_problem_chips` | Cached problem chips per role |

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd tesa-habit-builder

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run build:dev` | Build for development |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |

## Usage Guide

### Creating a Company Profile
1. Click "Manage Profiles" in the sidebar
2. Enter industry, company description, and initial roles
3. Click "Create Profile"

### Creating a Habit Program
1. Select a company and role from the sidebar
2. **Problem Statement**: Describe the challenge (use suggestion chips or type custom)
3. **Competency Selection**: Choose from AI-generated competencies
4. **Expected Outcome**: Define what success looks like
5. **Review Program**: Watch real-time program generation
6. **Select Habits**: Choose 2-5 habits to include
7. **Save**: Program is saved and associated with the role

### Copying Program Data
Once a program is generated, click the "Copy Program" button to copy all program details (name, description, and habit tasks) to your clipboard.

## UI Components

The application uses [shadcn/ui](https://ui.shadcn.com/) components built on Radix UI primitives:

- **Dialog** - Modal windows
- **Button** - Interactive buttons
- **Checkbox** - Selection controls
- **ScrollArea** - Scrollable containers
- **Tooltip** - Contextual information
- **Badge** - Status indicators
- **Textarea** - Text input areas

## Styling

- **Tailwind CSS** for utility-first styling
- **CSS Variables** for theming (light/dark mode support)
- **Animations** via `tailwindcss-animate`
- Custom animations: `fade-in-up`, `pulse` (for streaming cursors)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Private - All rights reserved.

---

Built with [Lovable](https://lovable.dev) | Powered by [Aspire](https://aspirenow.in)
#   t e s a - h a b i t - b u i l d e r - f r o n t e n d  
 