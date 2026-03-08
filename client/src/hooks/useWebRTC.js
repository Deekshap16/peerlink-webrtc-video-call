import { useEffect, useRef, useState } from 'react';
import { socket } from '../socket';

const ICE_SERVERS = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302'
    }
  ]
};

export function useWebRTC(roomId) {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [micMuted, setMicMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);

  const pcRef = useRef(null);
  const isInitiatorRef = useRef(false);
  const roomIdRef = useRef(roomId);

  useEffect(() => {
    roomIdRef.current = roomId;
  }, [roomId]);

  useEffect(() => {
    let isMounted = true;

    async function initMediaAndJoin() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

        if (!isMounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        setLocalStream(stream);

        // Connect to signaling server and join room after local media is ready.
        if (!socket.connected) {
          socket.connect();
        }

        registerSocketEvents();

        socket.emit('join-room', { roomId: roomIdRef.current });
      } catch (err) {
        console.error('Error getting user media', err);
      }
    }

    initMediaAndJoin();

    return () => {
      isMounted = false;
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function registerSocketEvents() {
    socket.off('created');
    socket.off('joined');
    socket.off('ready');
    socket.off('offer');
    socket.off('answer');
    socket.off('ice-candidate');
    socket.off('chat-message');
    socket.off('peer-left');

    socket.on('created', () => {
      isInitiatorRef.current = true;
    });

    socket.on('joined', () => {
      isInitiatorRef.current = false;
    });

    socket.on('ready', () => {
      if (isInitiatorRef.current) {
        createPeerConnection();
        createAndSendOffer();
      } else {
        createPeerConnection();
      }
    });

    socket.on('offer', async ({ offer }) => {
      try {
        if (!pcRef.current) {
          createPeerConnection();
        }
        await pcRef.current.setRemoteDescription(offer);
        const answer = await pcRef.current.createAnswer();
        await pcRef.current.setLocalDescription(answer);
        socket.emit('answer', {
          roomId: roomIdRef.current,
          answer
        });
      } catch (err) {
        console.error('Error handling offer', err);
      }
    });

    socket.on('answer', async ({ answer }) => {
      try {
        if (!pcRef.current) return;
        await pcRef.current.setRemoteDescription(answer);
      } catch (err) {
        console.error('Error handling answer', err);
      }
    });

    socket.on('ice-candidate', async ({ candidate }) => {
      try {
        if (pcRef.current && candidate) {
          await pcRef.current.addIceCandidate(candidate);
        }
      } catch (err) {
        console.error('Error adding received ICE candidate', err);
      }
    });

    socket.on('chat-message', ({ message, sender, timestamp }) => {
      setChatMessages((prev) => [...prev, { message, sender, timestamp }]);
    });

    socket.on('peer-left', () => {
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      setRemoteStream(null);
    });
  }

  function createPeerConnection() {
    if (pcRef.current) return;

    const pc = new RTCPeerConnection(ICE_SERVERS);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', {
          roomId: roomIdRef.current,
          candidate: event.candidate
        });
      }
    };

    pc.ontrack = (event) => {
      const [stream] = event.streams;
      setRemoteStream(stream);
    };

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
    }

    pcRef.current = pc;
  }

  async function createAndSendOffer() {
    try {
      const offer = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(offer);
      socket.emit('offer', {
        roomId: roomIdRef.current,
        offer
      });
    } catch (err) {
      console.error('Error creating offer', err);
    }
  }

  function toggleMic() {
    if (!localStream) return;
    const audioTracks = localStream.getAudioTracks();
    if (audioTracks.length === 0) return;
    const next = !micMuted;
    audioTracks.forEach((track) => {
      track.enabled = !next;
    });
    setMicMuted(next);
  }

  function toggleCamera() {
    if (!localStream) return;
    const videoTracks = localStream.getVideoTracks();
    if (videoTracks.length === 0) return;
    const next = !cameraOff;
    videoTracks.forEach((track) => {
      track.enabled = !next;
    });
    setCameraOff(next);
  }

  function sendChatMessage(text, sender = 'You') {
    if (!text.trim()) return;
    const message = text.trim();
    const payload = {
      roomId: roomIdRef.current,
      message,
      sender
    };
    socket.emit('chat-message', payload);
  }

  function cleanup() {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
    }
    socket.emit('leave-room', { roomId: roomIdRef.current });
    socket.removeAllListeners();
  }

  return {
    localStream,
    remoteStream,
    micMuted,
    cameraOff,
    chatMessages,
    toggleMic,
    toggleCamera,
    sendChatMessage,
    cleanup
  };
}

