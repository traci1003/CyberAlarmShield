# 🔐 CyberAlarmShield

A full-stack, real-time intrusion detection and threat monitoring app powered by TypeScript, Express, and AI. Built to track, alert, and visualize suspicious cyber activity — perfect for red team simulations, security dashboards, or educational tools.

> ✅ Try it live: [CyberAlarmShield /alarm View](https://1f29e15b-2391-4d1d-bead-3fb643e4b216-00-d5m90hpu8jz9.riker.replit.dev/alarm)

---

## 🚨 Features

### 📡 Live Threat Alarm System
- Real-time monitoring of endpoint alerts via REST API
- Alarm entries shown by time, user, ID, and message
- Useful for simulating penetration testing or active cyber defense

### 🔐 Secure Express API Backend
- TypeScript backend with `express` and `tsx` routing
- Modular and scalable structure for integration into any stack

### 📊 Clean UI with Replit Preview
- Simple, responsive frontend
- Designed to embed in dashboards or use in educational demos

---

## 🛠 Tech Stack

| Layer | Tools |
|-------|-------|
| Backend | TypeScript + Express |
| Frontend | HTML + CSS (lightweight view layer) |
| Hosting | Replit |
| Dev Tools | Replit Nix, custom `replit.nix` + `vite` setup |

---

## 📦 API Usage

```bash
GET /api/alarms
