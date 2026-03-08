## Project Preview

![PEERLINK UI]()
## PEERLINK – WebRTC Video Calling (MERN Stack)

PEERLINK is a clean and professional peer-to-peer video calling web application inspired by Google Meet, built with the MERN stack, WebRTC, and Socket.IO.

### Tech Stack

- **Frontend**: React, Vite, Socket.IO Client, WebRTC, basic CSS
- **Backend**: Node.js, Express.js, Socket.IO
- **Database**: MongoDB (optional – this implementation uses in-memory room storage for simplicity)

---

## Folder Structure

- **`server/`** – Express + Socket.IO signaling server
  - `index.js` – main server file (HTTP server, Socket.IO, room handling)
  - `package.json` – backend dependencies and scripts
- **`client/`** – React single-page app
  - `index.html` – root HTML template
  - `vite.config.js` – Vite configuration
  - `package.json` – frontend dependencies and scripts
  - `src/main.jsx` – React entry point
  - `src/App.jsx` – main app shell and routing
  - `src/components/VideoRoom.jsx` – WebRTC logic + layout
  - `src/components/ControlsBar.jsx` – bottom control bar (mic, camera, chat, leave)
  - `src/components/ChatPanel.jsx` – in-call chat messaging UI
  - `src/components/RoomLanding.jsx` – create / join room UI
  - `src/hooks/useWebRTC.js` – encapsulated WebRTC + Socket.IO logic (heavily commented)
  - `src/socket.js` – Socket.IO client instance
  - `src/styles.css` – global and layout styles

---

## Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- (Optional) MongoDB if you later extend room storage to persistence

---

## Installation

From the project root `PEERLINK` directory:

```bash
cd "C:\projects\Peer link"

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

## Running the Application

Open two terminals from the project root.

### 1. Start the Signaling Server

```bash
cd "C:\projects\Peer link\server"
npm run dev
```

The backend will start on `http://localhost:5000`.

### 2. Start the React Client

```bash
cd "C:\projects\Peer link\client"
npm run dev
```

Vite will print a local development URL (typically `http://localhost:5173`). Open it in your browser.

---

## Usage

1. Open the client URL in a browser.
2. On the landing screen:
   - Click **Create Room** to generate a new room ID, then share the ID with a peer.
   - Or, enter a **Room ID** received from another user and click **Join Room**.
3. Grant camera and microphone permissions when prompted.
4. You will see:
   - A **large remote video** area (once the peer joins).
   - A **floating local video preview**.
   - A **bottom-centered control bar** with mic, camera, chat toggle, and red leave button.
   - A **chat panel** for in-call messaging.

---

## Signaling Events (Backend)

The signaling server handles minimal events:

- `join-room` – join a room by ID; notifies peers when ready.
- `offer` – WebRTC offer from caller to callee.
- `answer` – WebRTC answer from callee to caller.
- `ice-candidate` – ICE candidate exchange between peers.
- `chat-message` – simple chat message relay inside a room.
- `leave-room` / `disconnect` – notify peers when someone leaves.

Rooms are stored **in-memory** for simplicity. You can extend this by adding MongoDB models and replacing the room store.

---

## Frontend Overview

- **`RoomLanding`** – Clean landing page to create or join rooms.
- **`VideoRoom`** – Hosts the entire call UI (videos, controls, chat).
- **`useWebRTC` hook** – Handles:
  - Getting user media (camera, mic)
  - Creating the RTCPeerConnection
  - Exchanging offers/answers/ICE via Socket.IO
  - Toggling mic/camera
  - Handling remote stream
  - Integrating basic chat

All WebRTC logic is commented to explain each step of the flow.

---

## Production Notes

- For production, run `npm run build` inside the `client` folder and serve the built static files behind a reverse proxy (e.g., Nginx) and the Node.js server.
- Use HTTPS and secure TURN/STUN servers for reliable connectivity across networks.
- Add authentication and persistence (MongoDB) if you need real-world deployments with user management and historical data.

Project name is displayed prominently as **PEERLINK** in the UI.


