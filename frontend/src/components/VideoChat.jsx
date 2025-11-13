import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Fade,
} from '@mui/material';
import {
  VideoCall, Phone, Videocam, VideocamOff, Mic, MicOff, CallEnd, PhoneDisabled
} from '@mui/icons-material';
import { connectSocketWithAuth } from '../socket/socketClient.js';
import { socket } from '../socket/socketClient.js';
import Layout from './Layout.jsx';
import { useLocation } from 'react-router-dom';

export default function VideoChat() {
  const localRef = useRef(null);
  const remoteRef = useRef(null);
  const pcRef = useRef(null);
  const userName = useRef('User-' + Math.floor(Math.random() * 100000));

  const [offers, setOffers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [socketReady, setSocketReady] = useState(false);
  const location = useLocation();

  const startStream = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 1280, height: 720 },
      audio: true,
    });

    if (localRef.current) {
      localRef.current.srcObject = stream;
    }

    setLocalStream(stream);
    return stream;
    } catch (error) {
      console.error('Media access error:', error);
      throw error;
    }
  };


  const setupPeer = (offerObj = null) => {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  });
  pcRef.current = pc;

  const remoteStream = new MediaStream();
  if (remoteRef.current) {
    remoteRef.current.srcObject = remoteStream;
  }

  pc.onicecandidate = (e) => {
    if (e.candidate) {
      socket.emit('sendIceCandidateToSignalingServer', {
        iceUserName: userName.current,
        iceCandidate: e.candidate,
        didIOffer: !offerObj,
      });
    }
  };

  pc.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };

  pc.oniceconnectionstatechange = () => {
    console.log("ICE connection state:", pc.iceConnectionState);
    if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed') {
      setIsConnected(false);
    }
  };

  if (localStream) {
    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });
  } else {
    console.warn("No localStream found while setting up peer.");
  }

  return pc;
};


  const call = async () => {
    setIsLoading(true);
    try {
      const stream = localStream || await startStream();

      if (!localStream) {
        setLocalStream(stream);
        if (localRef.current) {
          localRef.current.srcObject = stream;
        }
      }

      const pc = setupPeer();
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Send offer as { offer, offererUserName }
      socket.emit('newOffer', {
        offer,
        offererUserName: userName.current,
      });
      setIsInCall(true);

    } catch (err) {
      console.error('Call initiation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const answer = async (offerObj) => {
    setIsLoading(true);
    try {
      const stream = localStream || await startStream();

      if (!localStream) {
        setLocalStream(stream);
        if (localRef.current) {
          localRef.current.srcObject = stream;
        }
      }

      const pc = setupPeer(offerObj);

      await pc.setRemoteDescription(offerObj.offer);

      const answerSDP = await pc.createAnswer();
      await pc.setLocalDescription(answerSDP);

      socket.emit(
        'newAnswer',
        {
          answer: answerSDP,
          answererUserName: userName.current,
          offererUserName: offerObj.offererUserName,
        },
        (offererIceCandidates) => {
          offererIceCandidates.forEach(candidate => {
            if (candidate) {
              pc.addIceCandidate(new RTCIceCandidate(candidate));
            }
          });
        }
      );


      setIsInCall(true);
    } catch (err) {
      console.error('Answering error:', err);
    } finally {
      setIsLoading(false);
    }
  };


  const hangUp = () => {

    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    if (remoteRef.current) {
      remoteRef.current.srcObject = null;
    }

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop();
      });
      setLocalStream(null);
      if (localRef.current) {
        localRef.current.srcObject = null;
      }
    }

    setIsInCall(false);
    setIsAudioEnabled(true);
    setIsVideoEnabled(true);
  };


  const declineCall = (offerIndex) => {
    setOffers((prev) => {
      const declinedOffer = prev[offerIndex];
      if (declinedOffer?.offererUserName) {
        socket.emit("declineOffer", {
          offererUserName: declinedOffer.offererUserName,
        });
      }
      return prev.filter((_, i) => i !== offerIndex);
    });
  };


  const toggleVideo = () => {
    const track = localStream?.getVideoTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setIsVideoEnabled(track.enabled);
    }
  };

  const toggleAudio = () => {
    const track = localStream?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setIsAudioEnabled(track.enabled);
    }
  };


  useEffect(() => {
    connectSocketWithAuth({ userName: userName.current, password: 'x' });

    const handleConnect = () => {
      setIsConnected(true);
      setSocketReady(true);
      console.log("Socket connected");
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      setSocketReady(false);
      console.log("Socket disconnected");
    };

    const handleOffers = (offersList) => setOffers(offersList);

    const iceQueue = [];
    let remoteSet = false;

    const handleAnswer = async (offerObj) => {
      try {
        await pcRef.current.setRemoteDescription(offerObj.answer);
        remoteSet = true;
        setIsInCall(true);
        for (const candidate of iceQueue) {
          await pcRef.current?.addIceCandidate(candidate);
        }
      } catch (e) {
        console.error('Remote description error:', e);
      }
    };

    const handleCandidate = async (candidate) => {
      if (!remoteSet) {
        iceQueue.push(candidate);
      } else {
        try {
          await pcRef.current?.addIceCandidate(candidate);
        } catch (e) {
          console.error('Add ICE error:', e);
        }
      }
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('availableOffers', handleOffers);
    socket.on('answerResponse', handleAnswer);
    socket.on('receivedIceCandidateFromServer', handleCandidate);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('availableOffers', handleOffers);
      socket.off('answerResponse', handleAnswer);
      socket.off('receivedIceCandidateFromServer', handleCandidate);
      socket.disconnect();
    };
  }, []);


  useEffect(() => {
    let activeStream = null;

    const init = async () => {
      try {
        const stream = await startStream();
        activeStream = stream;
      } catch (_) {}
    };
    init();

    return () => {
      activeStream?.getTracks().forEach((track) => track.stop());
    };
  }, []);


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const joinCode = params.get('join');

    if (joinCode && joinCode !== userName.current) {
      const tryJoin = (offersList) => {
        const offer = offersList.find(
          (o) => o.offererUserName === joinCode && !o.answer
        );
        if (offer) {
          answer(offer);
        }
      };

      if (offers.length > 0) {
        tryJoin(offers);
      }

      const listener = (offersList) => tryJoin(offersList);
      socket.on('availableOffers', listener);

      return () => {
        socket.off('availableOffers', listener);
      };
    }
  }, [location.search, offers]);


  // --- Incoming Offers: only show those not from self and not answered ---
  const incomingOffers = offers.filter(
    (offer) =>
      offer.offererUserName !== userName.current &&
      !offer.answer
  );

  // --- Render ---
  return (
    <>
    <Layout title="StreamConnect">
      <Box sx={{ position: 'relative', width: '100%', height: 'calc(100vh - 120px)' }}>
      
        {/* Remote Stream */}
        <Box
          sx={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: '#111'
          }}
        >
          <video
            ref={remoteRef}
            autoPlay
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {!isInCall && (
            <Box
              sx={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                backgroundColor: '#111'
              }}
            >
              <VideoCall sx={{ fontSize: 80, color: '#333', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#666' }}>
                No active call
              </Typography>
            </Box>
          )}
        </Box>

        {/* Local Stream */}
        <Box
          sx={{
            position: 'absolute', top: 20, right: 20, width: 280, height: 158,
            borderRadius: 2, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)',
            backgroundColor: '#111', zIndex: 10
          }}
        >
          <video
            ref={localRef}
            autoPlay
            playsInline
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {!isVideoEnabled && (
            <Box
              sx={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: '#111'
              }}
            >
              <VideocamOff sx={{ fontSize: 32, color: '#666' }} />
            </Box>
          )}
        </Box>

        {/* Status Info */}
        <Box
          sx={{
            position: 'absolute', top: 20, left: 20, p: 1.5, px: 2,
            backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 1,
            border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)'
          }}
        >
          <Typography variant="caption" sx={{ color: '#888' }}>
            {userName?.current || 'Unknown User'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
            <Box
              sx={{
                width: 6, height: 6, borderRadius: '50%',
                backgroundColor: isConnected ? '#00ff88' : '#ff4444'
              }}
            />
            <Typography variant="caption" sx={{ color: '#fff', fontSize: '0.7rem' }}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Typography>
          </Box>
        </Box>

        {/* Call Controls */}
        <Box
          sx={{
            position: 'absolute', bottom: 30, left: '50%',
            transform: 'translateX(-50%)', display: 'flex', gap: 2,
            backgroundColor: 'rgba(0,0,0,0.8)', px: 3, py: 2,
            borderRadius: 3, backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          {!isInCall && (
            <Button
              variant="contained"
              startIcon={<VideoCall />}
              onClick={call}
              disabled={!socketReady || isLoading}
              sx={{
                backgroundColor: '#fff', color: '#000', px: 3, py: 1,
                borderRadius: 2, fontWeight: 500,
                '&:hover': { backgroundColor: '#eee' },
                '&:disabled': { backgroundColor: '#333', color: '#666' }
              }}
            >
              {isLoading ? 'Starting...' : 'Start Call'}
            </Button>
          )}

          {localStream && (
            <>
              <IconButton
                onClick={toggleVideo}
                sx={{
                  backgroundColor: isVideoEnabled ? 'rgba(255,255,255,0.1)' : 'rgba(255,68,68,0.2)',
                  color: isVideoEnabled ? '#fff' : '#ff4444'
                }}
              >
                {isVideoEnabled ? <Videocam /> : <VideocamOff />}
              </IconButton>
              <IconButton
                onClick={toggleAudio}
                sx={{
                  backgroundColor: isAudioEnabled ? 'rgba(255,255,255,0.1)' : 'rgba(255,68,68,0.2)',
                  color: isAudioEnabled ? '#fff' : '#ff4444'
                }}
              >
                {isAudioEnabled ? <Mic /> : <MicOff />}
              </IconButton>
              {isInCall && (
                <IconButton onClick={hangUp} sx={{ backgroundColor: '#ff4444', color: '#fff' }}>
                  <CallEnd />
                </IconButton>
              )}
            </>
          )}
        </Box>

        {/* Incoming Offers */}
        {incomingOffers.length > 0 && !isInCall && (
          <Fade in>
            <Box
              sx={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)',
                p: 4, borderRadius: 3, border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center'
              }}
            >
              <Phone sx={{ fontSize: 48, color: '#fff', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
                Incoming Call
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                {incomingOffers.map((offer, index) => (
                  <React.Fragment key={index}>
                    <Button
                      variant="contained"
                      onClick={() => answer(offer)}
                      startIcon={<Phone />}
                      disabled={isLoading}
                      sx={{
                        backgroundColor: '#00ff88', color: '#000', fontWeight: 500,
                        px: 3, py: 1.5, borderRadius: 2,
                        '&:hover': { backgroundColor: '#00dd77' }
                      }}
                    >
                      Answer
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<PhoneDisabled />}
                      onClick={() => declineCall(index)}
                      sx={{
                        borderColor: '#ff4444', color: '#ff4444', fontWeight: 500,
                        px: 3, py: 1.5, borderRadius: 2,
                        '&:hover': { backgroundColor: 'rgba(255,68,68,0.1)', borderColor: '#ff3333' }
                      }}
                    >
                      Decline
                    </Button>
                  </React.Fragment>
                ))}
              </Box>
              <Typography variant="caption" sx={{ color: '#888', mt: 2 }}>
                from {incomingOffers[0]?.offererUserName || 'someone'}
              </Typography>
            </Box>
          </Fade>
        )}
      </Box>
    </Layout>
    </>
  );

}