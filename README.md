# Flow State

A personal energy management app that learns your unique patterns and helps you schedule tasks when you're most capable of doing them.

## Why This Exists

Most productivity apps treat every day the same. They're not. Your energy fluctuates based on:
- **Circadian rhythm** - morning person vs night owl
- **Menstrual cycle** - hormonal changes affect cognition, energy, and mood across ~28 days
- **Weekly patterns** - Monday slumps, Friday wind-downs
- **Post-meeting fatigue** - context switching costs
- **Sleep quality** - yesterday affects today

Flow State learns YOUR patterns and tells you the best time to do different types of work.

## Core Features

### 1. Cycle Tracking Integration
- Log or sync your menstrual cycle
- Understands the 4 phases and their energy signatures:
  - **Menstrual (Days 1-5)**: Lower energy → reflection, lighter tasks, rest
  - **Follicular (Days 6-14)**: Rising energy → start new projects, brainstorm, learn
  - **Ovulation (Days 14-16)**: Peak energy → presentations, difficult conversations, big tasks
  - **Luteal (Days 17-28)**: Declining energy → detail work, finishing projects, admin

### 2. Energy Logging
- Quick daily/hourly energy check-ins (1-10 scale)
- Mood and focus tracking
- Correlates with cycle phase, sleep, calendar

### 3. Goal Management
- Set short-term and long-term goals
- Categorize tasks by cognitive load:
  - **Deep work**: coding, writing, analysis
  - **Creative**: brainstorming, design
  - **Social**: meetings, calls, collaboration
  - **Admin**: emails, scheduling, busywork

### 4. Smart Recommendations
- "You're in your follicular phase and it's 10am - great time for that project kickoff"
- "Luteal phase + afternoon slump - maybe save the complex debugging for tomorrow morning"
- Learns what works for YOU over time

### 5. Calendar Integration
- Sees your existing commitments
- Suggests optimal times to schedule different task types
- Warns about scheduling deep work right after meetings

## Tech Stack

- **Mobile App**: React Native + Expo (iOS & Android)
- **Backend**: Python FastAPI
- **Database**: SQLite (local-first for privacy)
- **ML**: scikit-learn for pattern recognition
- **Optional Sync**: Supabase for cross-device

## Privacy First

All data stays on your device by default. Your cycle data, energy patterns, and goals are yours. Cloud sync is optional and encrypted.

## Project Structure

```
flow-state/
├── mobile/                 # React Native Expo app
│   ├── app/               # Screens and navigation
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API and storage services
│   └── utils/             # Helper functions
├── backend/               # Python FastAPI server
│   ├── api/              # API routes
│   ├── models/           # Data models
│   ├── ml/               # Machine learning models
│   └── services/         # Business logic
├── shared/               # Shared types and constants
└── docs/                 # Documentation
```

## Getting Started

```bash
# Clone the repo
git clone https://github.com/HarshitaThota/Flow-State.git
cd Flow-State

# Mobile app
cd mobile
npm install
npx expo start

# Backend (optional, for ML predictions)
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## Roadmap

- [ ] Phase 1: Core logging (energy, cycle, goals)
- [ ] Phase 2: Pattern visualization (see your trends)
- [ ] Phase 3: Basic recommendations (rule-based)
- [ ] Phase 4: ML predictions (personalized)
- [ ] Phase 5: Calendar integration
- [ ] Phase 6: Widgets and notifications

## Research Behind This

- [Cognitive performance across the menstrual cycle](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5765737/)
- [Circadian rhythms and cognitive function](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3654533/)
- [Energy management vs time management](https://hbr.org/2007/10/manage-your-energy-not-your-time)
