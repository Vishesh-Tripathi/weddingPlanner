# Q1 – Leveraging AI in Front-End Delivery

Describe, with concrete examples, how you would use AI-powered coding or design assistants to accelerate front-end development in a startup where shipping fast matters but code quality can’t slip.

Answer:
Use AI assistants to scaffold components, convert designs to code, and enforce quality without slowing delivery. Concrete examples:

- Component scaffolding: prompt an AI to generate a TypeScript React/React Native component with props typing, PropTypes/comments, a Storybook story, and a Jest unit test; run tsc + ESLint to catch type and style issues immediately.

- Design-to-code: export Figma frames to responsive React/React Native components (design tokens, spacing, colors) then refine accessibility attributes and state handling in code.

- Tests & QA automation: ask the AI to produce unit tests and Playwright/Cypress E2E flows from acceptance criteria, plus an accessibility checklist; integrate generated tests into CI so coverage gates prevent regressions.

- PR assistant & refactor suggestions: AI drafts PR descriptions, points out risky changes, and proposes small automated refactors; humans review and approve all AI output.

Guardrails: require TypeScript, mandatory CI checks (lint/tests), human review for critical paths, and incremental commits. This workflow speeds delivery while keeping code quality high.


# Q2 – Inventing an AI Feature for Class 11 Students

You’re tasked with designing a new AI feature that makes Physics revision easier for Indian class 11 students. Outline two key features and sketch the user journey in plain text.

Answer:
Feature name: Smart Revision Lab — two key features and a plain-text user journey.

1) Adaptive Concept Tutor — a 10–15 minute diagnostic maps student strengths/weaknesses to NCERT topics and builds a personalized syllabus. The tutor delivers 2–5 minute micro-lessons (bilingual: English/Hindi) that emphasise core formulas, derivations, and common misconceptions. It schedules spaced-repetition flashcards (SRS) and short worked examples tailored to the student’s error patterns.

2) Interactive Problem Studio — students solve problems step-by-step; the AI verifies algebraic steps (symbolic math), offers graduated hints, and only reveals full solutions after attempts. It generates similar practice problems of increasing difficulty and small visual simulations (motion plots, free-body diagrams) to build intuition.

User journey (plain text): sign up → select language & syllabus → take diagnostic → receive prioritized topic list → open a topic → watch micro-lesson → practice 5 problems in Problem Studio with hints and simulations → review scheduled flashcards → take weekly mock → view progress report; exportable for teachers/parents.
