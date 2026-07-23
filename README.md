# 🤖 Palomine

### *Not just an AI. Your pal. Your way.*

[![Live App](https://img.shields.io/badge/Production_App-palomine.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://palomine.vercel.app)
[![Source Code](https://img.shields.io/badge/Source_Code-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/WilliamChonOrtega/palomine)
[![Stack](https://img.shields.io/badge/Tech_Stack-JavaScript_|_Tailwind_|_Vercel_Serverless_|_Gemini_2.5-blue?style=for-the-badge)](https://palomine.vercel.app)

---

## 📌 Executive Summary

**Palomine** (a play on *"Pal of Mine"*) is a personalized AI companion platform that allows users to create emotionally resonant AI personas based on key relationships in their lives.

Rather than interacting with a generic, transaction-focused AI assistant, users configure custom companions—such as a **Mom, Dad, Coach, Mentor, Best Friend, Older Sibling, or Lost Loved One**. Each companion manages an isolated conversation state, personality parameters, memory contextualization, and persistent identity to deliver an authentic, highly personal interaction model.

Built with **HTML5, Tailwind CSS, Vanilla JavaScript (ES6+), Google Gemini 2.5 Flash, and a secure Vercel Serverless Function architecture**, Palomine showcases secure credential proxying, raw stream payload aggregation, state persistence, and empathetic UI product design.

---

## ✨ Inspiration & Vision

> *"Technology often focuses on speed and productivity. Palomine focuses on human connection."*

Palomine grew out of a persistent question following the COVID-19 pandemic: **What about the people who had to go through life's hardest moments alone?**

While standard conversational AI aims to solve tasks, Palomine is engineered to foster presence and connection. Whether a user seeks grounded encouragement from a parent figure, structured accountability from a coach, or a compassionate ear during a quiet evening, Palomine provides an adaptive emotional outlet. 

The core thesis is simple: **Emotionally intelligent software should complement—never replace—human relationships.**

---

## 🏗 System Architecture

Palomine isolates client-side rendering logic from upstream AI vendors using a server-side proxy pattern:

```text
┌─────────────────────────┐
│     Client Browser      │
│  (UI / LocalStorage)    │
└────────────┬────────────┘
             │ 1. POST /api/chat { message }
             ▼
┌─────────────────────────┐
│ Vercel Serverless Layer │ ◄── Securely injects process.env.GEMINI_API_KEY
│  (Node.js Handler)      │ ◄── Handles raw stream buffering & fallback parsing
└────────────┬────────────┘
             │ 2. Authenticated REST Request
             ▼
┌─────────────────────────┐
│ Google Gemini 2.5 Flash │
│     (Generative AI)     │
└─────────────────────────┘
