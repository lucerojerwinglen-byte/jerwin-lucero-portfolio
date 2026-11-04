import type { ExperienceItem } from "@/types/content";

export const experience: ExperienceItem[] = [
  {
    id: "sagility",
    org: "Sagility",
    role: "Workday Transactions Analyst",
    period: "Aug 2025 — present",
    location: "Quezon City (hybrid)",
    bullets: [
      "Execute HR transactions in Workday (job changes, transfers, terminations), validating every request for completeness and accuracy before processing.",
      "Keep audit-ready transaction logs; record anomalies and escalate failed transactions per protocol.",
      "Support periodic quality checks and process audits; uphold data integrity and confidentiality.",
    ],
    note: "Where I learned that a blank cell can mean three different things.",
  },
  {
    id: "bu-nlp",
    org: "Bicol University NLP lab",
    role: "On-the-Job Trainee",
    period: "2024",
    summary:
      "QA for the BOSESKO mobile and web app; co-developed the e-Participation 2.0 website (WordPress); literature review for lab research.",
  },
];
