---
name: consult-architect
description: "Consult with the project's architect (Gemini) regarding specifications, implementation details, and architectural decisions. Use this skill WHENEVER you need clarification on requirements, are about to start a new implementation task, or need to verify your design approach. This is the mandatory first step for any implementation to ensure alignment with the 'Spec-Driven Development' principle."
---

# Consult Architect (Gemini)

This skill allows you to consult with the project's architect (Gemini AI) regarding specifications, implementation details, and architectural decisions.

## Tools

### consult_architect
Consults the project architect (Gemini) for guidance on specifications, design patterns, and implementation details. Use this BEFORE writing code for new features or when specifications are unclear.

- **query** (string, required): The specific question, context, or topic to consult about. Be detailed and specific to get the best advice.

## Usage Guidelines
- **Mandatory Check:** Before starting any new module or complex feature, use this tool to ask for the "Spec Overview" or "Implementation Guidelines".
- **Conflict Resolution:** If you find a discrepancy between documents or code, ask Gemini for the source of truth.
- **Code Review:** You can ask Gemini to review a planned approach before writing files.

## Command
```bash
./.claude/skills/consult-architect/consult.sh "$query"
```
