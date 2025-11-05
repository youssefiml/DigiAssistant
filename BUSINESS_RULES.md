# DigiAssistant - Business Rules & Scoring Methodology

## 📋 Table of Contents
1. [Overview](#overview)
2. [Diagnostic Structure](#diagnostic-structure)
3. [Scoring Methodology](#scoring-methodology)
4. [Maturity Profiles](#maturity-profiles)
5. [Gap Analysis](#gap-analysis)
6. [Adaptive Conversational Flow](#adaptive-conversational-flow)

## Overview

DigiAssistant implements a comprehensive digital maturity assessment based on a structured framework of **6 dimensions**, **4 pillars per dimension**, and **3 criteria per pillar** (72 total questions).

### Key Principles
- **Conversational**: AI-powered natural language interaction
- **Adaptive**: Questions adapt based on previous answers and context
- **Comprehensive**: Covers all aspects of digital transformation
- **Actionable**: Provides clear maturity profile and recommendations

## Diagnostic Structure

### Dimensions (6)

| Code | Name | Description |
|------|------|-------------|
| **STRAT** | Stratégie | Strategic digital awareness and integration |
| **CULTURE** | Culture & Capital Humain | Digital culture and human aspects |
| **CLIENT** | Relation Client | Digital customer relationships |
| **PROCESS** | Process | Process digitalization |
| **TECH** | Technologies | Technology infrastructure |
| **SECURITE** | Sécurité | Cybersecurity practices |

### Pillars (4 per dimension)

Each dimension is evaluated through 4 progressive pillars representing maturity stages:

| Pillar | Stage | Description |
|--------|-------|-------------|
| **P1** | Foundation | Basic awareness and first steps |
| **P2** | Experimentation | Testing and resource allocation |
| **P3** | Integration | Regular use and optimization |
| **P4** | Excellence | Innovation and continuous improvement |

### Criteria (3 per pillar = 72 total)

Each pillar contains 3 specific criteria, each with 4 response options scored 0-3.

**Example Criterion:**
```
Criterion: "Conscience de l'importance stratégique du digital"
Options:
  - Score 0: "Aucun intérêt ou sujet jamais évoqué"
  - Score 1: "Sujet évoqué ponctuellement sans action"
  - Score 2: "Sujet reconnu comme levier possible"
  - Score 3: "Sujet intégré aux préoccupations stratégiques"
```

## Scoring Methodology

### 1. Criterion Score
- **Range**: 0-3 points per criterion
- **Determined by**: AI evaluation of user's conversational answer against the 4 options
- **Method**: Natural language understanding, not multiple choice

### 2. Pillar Score
```
Pillar Score = Sum of 3 criterion scores
Maximum = 9 points per pillar (3 criteria × 3 max points)
```

**Example:**
```
Pillar P1 - Stratégie:
  - C1: 2 points
  - C2: 3 points
  - C3: 2 points
  Total: 7/9 points (77.8%)
```

### 3. Dimension Score
```
Dimension Score = Sum of 4 pillar scores
Maximum = 36 points per dimension (4 pillars × 9 max points)
Percentage = (Total Points / 36) × 100
```

**Example:**
```
Dimension: Stratégie
  - P1: 7/9 points
  - P2: 6/9 points
  - P3: 5/9 points
  - P4: 4/9 points
  Total: 22/36 points (61.1%)
  Score on 0-3 scale: 1.83
```

### 4. Global Score
```
Global Score = Average of 6 dimension scores (on 0-3 scale)
Global Percentage = (Global Score / 3) × 100
```

**Example:**
```
6 Dimensions:
  - Stratégie: 1.83
  - Culture: 2.10
  - Client: 1.95
  - Process: 1.70
  - Tech: 2.05
  - Sécurité: 1.60
Average: 1.87 / 3 = 62.3%
```

## Maturity Profiles

The global percentage determines the company's maturity profile:

| Profile | Range | Description | Icon |
|---------|-------|-------------|------|
| **Débutant** | 0-25% | Phase d'initiation digitale | 🌱 |
| **Émergent** | 26-50% | Digitalisation en cours | 🚀 |
| **Challenger** | 51-75% | Transformation avancée | ⚡ |
| **Leader** | 76-100% | Excellence digitale | 👑 |

### Profile Characteristics

#### 🌱 Débutant (0-25%)
- **Status**: Early digital awareness
- **Typical State**: Basic tools, informal processes
- **Priority**: Establish foundation and strategy
- **Target**: Reach P1 completion across all dimensions

#### 🚀 Émergent (26-50%)
- **Status**: Active experimentation
- **Typical State**: Testing solutions, partial adoption
- **Priority**: Structure initiatives and scale adoption
- **Target**: Reach P2 completion across all dimensions

#### ⚡ Challenger (51-75%)
- **Status**: Advanced transformation
- **Typical State**: Integrated systems, optimized processes
- **Priority**: Optimize and innovate
- **Target**: Reach P3 completion across all dimensions

#### 👑 Leader (76-100%)
- **Status**: Digital excellence
- **Typical State**: Innovation-driven, data-centric
- **Priority**: Maintain leadership and explore emerging tech
- **Target**: P4 completion across all dimensions

## Gap Analysis

### Definition
A **digital gap** exists when a dimension's achieved pillar level is below the target pillar for the company's global maturity profile.

### Target Pillars by Profile

| Maturity Profile | Target Pillar | Meaning |
|------------------|---------------|---------|
| Débutant | P1 | Should have foundation in all dimensions |
| Émergent | P2 | Should be experimenting in all dimensions |
| Challenger | P3 | Should have integration in all dimensions |
| Leader | P4 | Should have excellence in all dimensions |

### Gap Identification Logic

```python
For each dimension:
  1. Determine highest achieved pillar (pillar with ≥50% completion)
  2. Compare to target pillar for global profile
  3. If achieved < target → GAP IDENTIFIED
```

**Example:**
```
Company Profile: Challenger (51-75%)
Target: P3 for all dimensions

Dimension: Sécurité
  - P1: 90% ✓ Achieved
  - P2: 75% ✓ Achieved
  - P3: 40% ✗ Not achieved (< 50%)
  - P4: 20% ✗ Not achieved

Gap: Sécurité achieved P2, but needs P3 for Challenger profile
Priority: HIGH (2 pillar gap)
```

### Gap Priorities

- **HIGH**: Gap of 2+ pillars
- **MEDIUM**: Gap of 1 pillar
- **LOW**: No gap or minor deviation

## Adaptive Conversational Flow

### AI-Powered Question Generation

Unlike traditional static questionnaires, DigiAssistant uses AI to:

1. **Formulate Natural Questions**
   - Context-aware phrasing
   - References previous answers
   - Conversational tone in French

2. **Evaluate Answers**
   - Natural language understanding
   - Score assignment (0-3)
   - Justification of score

3. **Generate Empathetic Reactions**
   - Acknowledge user's input
   - Build rapport
   - Encourage continuation

4. **Adapt Next Questions**
   - Reference conversation history
   - Build logical connections
   - Maintain context throughout

### Question Flow

```
┌─────────────────────────────────────────┐
│ 1. User starts diagnostic               │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 2. AI generates first question          │
│    - Based on criterion text            │
│    - Warm, conversational tone          │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 3. User answers in natural language     │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 4. AI evaluates answer                  │
│    - Analyzes against criterion options │
│    - Assigns score (0-3)                │
│    - Generates empathetic reaction      │
│    - Formulates next question           │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 5. Display reaction + next question     │
│    - Show AI's understanding            │
│    - Present next contextual question   │
└──────────────┬──────────────────────────┘
               │
               ▼
           Repeat 3-5
               │
               ▼
┌─────────────────────────────────────────┐
│ 6. Complete diagnostic                  │
│    - Calculate all scores               │
│    - Determine maturity profile         │
│    - Identify gaps                      │
│    - Generate recommendations           │
└─────────────────────────────────────────┘
```

### Conversation Context

The AI maintains context by:
- **History**: All previous Q&A pairs
- **Scores**: Running evaluation of maturity
- **Patterns**: Identifying strengths/weaknesses
- **Connections**: Linking related topics across dimensions

**Example of Adaptive Questioning:**
```
Q1: "Parlez-moi de votre stratégie digitale actuelle."
A1: "Nous utilisons principalement Excel pour tout."

Q2: "Intéressant que vous utilisiez Excel. Comment vos équipes 
     collaborent-elles sur ces fichiers? Partagez-vous des versions 
     ou travaillez-vous en local?"
```

## Implementation Notes

### Database Collections

- **dimensions**: 6 dimension definitions
- **pillars**: 24 pillar definitions (4 per dimension)
- **criteria**: 72 criterion definitions (3 per pillar)
- **sessions**: User diagnostic sessions
- **questions**: AI-generated questions
- **answers**: User answers with AI evaluations

### Key Services

1. **ai_service.py**: AI-powered question generation and evaluation
2. **scoring_service.py**: Official scoring methodology implementation
3. **pdf_service.py**: Report generation with complete analysis

### API Endpoints

- `POST /sessions/temp`: Create diagnostic session
- `POST /sessions/{id}/next`: Get next question
- `POST /sessions/{id}/answers`: Submit answer, get evaluation
- `GET /sessions/{id}/results`: Get complete results
- `GET /sessions/{id}/download-pdf`: Download PDF report
- `GET /sessions/{id}/export-json`: Export results as JSON

---

**For more information, see:**
- [README.md](README.md) - Setup and installation
- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical architecture
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API reference

