## StreamConnect WebRTC Platform

StreamConnect is a full-stack WebRTC video conferencing demo that pairs a React + Vite frontend with a Node.js/Express signaling server powered by Socket.IO. The project showcases secure peer-to-peer audio/video calls, a polished Material-UI interface, and an HTTPS-by-default developer experience (via mkcert).

---

### ✨ Features
- React SPA with Material-UI theming, responsive layouts, and router-based navigation
- WebRTC peer connections with ICE candidate exchange and Google STUN support
- Socket.IO signaling server over HTTPS + WSS
- Join-by-code workflow, call controls (mute, video toggle, hang up), and offer management
- Developer tooling for secure local HTTPS using mkcert

---

### 🧰 Tech Stack
| Layer | Tools |
| --- | --- |
| Frontend | React 19, Vite 7, Material-UI 7, Socket.IO Client 4 |
| Backend | Node.js 18+, Express 5, Socket.IO 4 |
| WebRTC | Browser `RTCPeerConnection`, `getUserMedia`, Google STUN |
| Tooling | mkcert (local certs), ESLint 9 |

---

### 📁 Project Structure
```
.
├── backend/
│   ├── certs/               # Local HTTPS certificates (ignored by git)
│   ├── server.js            # Express + Socket.IO signaling server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # VideoChat, Layout
│   │   ├── pages/           # Home, Login, Profile
│   │   └── socket/          # socket.io client configuration
│   ├── vite.config.js       # HTTPS dev server + proxy into backend
│   └── package.json
├── Tech_Detail.md           # In-depth technical analysis
├── Team_Assignment.md       # Role breakdown for team presentations
└── README.md                # You are here
```

---

### ✅ Prerequisites
- **Node.js 18+** and **npm**
- **Git**
- **mkcert** for generating trusted local certificates
  - On Windows we recommend installing via Chocolatey
- Optional: a TURN service for production-grade NAT traversal (not included here)

---

### 🪟 Install mkcert on Windows (via Chocolatey)
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12
Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

choco install mkcert -y
```

For macOS with Homebrew:
```bash
brew install mkcert nss
```

After installing mkcert (any platform):
```bash
mkcert -install
```

This creates a local Certificate Authority trusted by your system/browsers.

---

### 🔐 Generate Project Certificates
Certificates are ignored by git. Generate them once per machine:

```bash
cd backend
mkdir -p certs
mkcert -key-file certs/cert.key -cert-file certs/cert.crt localhost 127.0.0.1 ::1
```

If you plan to access from other LAN devices, add their IP addresses to the mkcert command (e.g. `192.168.1.25`).

---

### ⚙️ Local Development
#### 1. Install dependencies
```bash
cd backend
npm install

cd ../frontend
npm install
```

#### 2. Configure Socket Endpoint
Update `frontend/src/socket/socketClient.js` with the correct backend URL. For local dev it should match where `server.js` runs (default `https://localhost:8181`). For friendlier configuration you can replace the hard-coded string with `import.meta.env.VITE_SOCKET_URL` and define it in `.env`.

#### 3. Start servers (two terminals recommended)
```bash
# Terminal 1 - backend
cd backend
npm run dev    # or npm start

# Terminal 2 - frontend
cd frontend
npm run dev
```

Vite serves the SPA over HTTPS (default https://localhost:5173) and proxies `/socket.io` traffic to the backend signaling server listening on https://localhost:8181.

Open **two browser windows** (accept the certificate warning on first launch) and join/create a meeting to test peer-to-peer video.

---

### 📦 Production Build & Preview
```bash
cd frontend
npm run build      # outputs to frontend/dist
npm run preview    # optional static preview
```

The backend already serves `frontend/dist`; after building, run:
```bash
cd backend
npm start          # launches HTTPS server + Socket.IO, serving the built frontend
```

---

### 🔧 Environment & Security Notes
- **Socket endpoint**: edit `frontend/src/socket/socketClient.js` or use `VITE_SOCKET_URL`.
- **Certificates**: keep private keys out of git—store them in `backend/certs` as generated.
- **CORS**: currently open (`origin: "*"`) for development. Restrict it before deployment.
- **TURN server**: add TURN credentials in `setupPeer` for reliable connectivity in restrictive networks.
- **Authentication**: replace the demo password check (`password === "x"`) with real auth in production.

---

### 🧪 Quick Validation Checklist
- `npm run dev` (frontend & backend) succeeds over HTTPS
- Two browser sessions can start and join calls
- Audio/video toggle & hang up work
- Linter passes: `cd frontend && npm run lint`

---

### 🤝 Contributing / Presenting
- `Tech_Detail.md` contains a deep-dive technical analysis of the codebase.
- `Team_Assignment.md` maps each major component to a team member-friendly presentation.

---

### 📜 License
This project is supplied as an educational demo. Adapt licensing as needed for your final submission.

