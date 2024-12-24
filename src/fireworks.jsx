import { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Volume2, VolumeX } from 'lucide-react';

const FireworksWithAudioAndLogo = () => {
  const canvasRef = useRef(null);
  const firecrackerAudio = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const snowflakes = [];
    const fireworks = [];
    const fireworkColors = ['#ff5733', '#33ff57', '#5733ff', '#ffd700', '#ff33aa', '#ff00ff'];

    const generateSnowflakes = () => {
      if (Math.random() < 0.05) {
        snowflakes.push({
          x: Math.random() * canvas.width,
          y: -10,
          size: Math.random() * 5 + 2,
          speed: Math.random() * 2 + 1,
        });
      }
    };

    const drawSnowflakes = () => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      for (let i = snowflakes.length - 1; i >= 0; i--) {
        const s = snowflakes[i];
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        s.y += s.speed;
        if (s.y > canvas.height) {
          snowflakes.splice(i, 1);
        }
      }
    };

    const createFirework = (x, y) => {
      const particles = [];
      const color = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
      const numParticles = Math.random() * 20 + 30;
      for (let i = 0; i < numParticles; i++) {
        const angle = (Math.PI * 2 * i) / numParticles;
        const speed = Math.random() * 3 + 2;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          size: Math.random() * 3 + 1,
          color,
        });
      }
      fireworks.push(...particles);
    };

    const drawFireworks = () => {
      for (let i = fireworks.length - 1; i >= 0; i--) {
        const f = fireworks[i];
        ctx.globalAlpha = f.alpha;
        ctx.fillStyle = f.color;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
        ctx.fill();
        f.x += f.vx;
        f.y += f.vy;
        f.alpha -= 0.02;
        if (f.alpha <= 0) {
          fireworks.splice(i, 1);
        }
      }
      ctx.globalAlpha = 1;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      generateSnowflakes();
      drawSnowflakes();
      drawFireworks();

      if (Math.random() < 0.05) {
        createFirework(Math.random() * canvas.width, Math.random() * canvas.height / 2);
      }

      requestAnimationFrame(animate);
    };

    firecrackerAudio.current = new Audio('firecracker.mp3');
    firecrackerAudio.current.loop = true;
    firecrackerAudio.current.volume = 0.5;

    // Try to play the audio automatically
    firecrackerAudio.current.play().catch((err) => {
      console.log("Audio play failed:", err);
    });

    animate();

    return () => {
      if (firecrackerAudio.current) {
        firecrackerAudio.current.play();
        firecrackerAudio.current = null;
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const toggleAudio = () => {
    if (firecrackerAudio.current) {
      if (isPlaying) {
        firecrackerAudio.current.play();
      } else {
        firecrackerAudio.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        backgroundColor: '#000',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />

      <Box
        sx={{
          position: 'relative',
          textAlign: 'center',
          zIndex: 1,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontFamily: 'Dancing Script, cursive',
            fontSize: { xs: '2rem', sm: '4rem', md: '6rem' },
            color: '#ffd700',
            textShadow: '0px 0px 20px rgba(255, 223, 0, 0.8)',
            mb: 2,
            position: 'relative',
            display: 'inline-block',
            animation: 'textAnimation 3s ease-out',
            '@keyframes textAnimation': {
              from: { opacity: 0, transform: 'translateY(-20px)' },
              to: { opacity: 1, transform: 'translateY(0)' }
            }
          }}
        >
          Merry Christmas!
          <Box
            component="img"
            src="/santa-hat.png"
            alt="Santa Hat"
            sx={{
              position: 'absolute',
              top: {xs:"-4%",md:'-21%'},
              left:  {xs:"15%",md:'0%'},
              width: { xs: '30px', sm: '70px', md: '100px' },
              transform: 'rotate(-15deg)',
            }}
          />
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            mt: 2,
          }}
        >
          <Box
            component="img"
            src="/logo.png"
            alt="Logo"
            sx={{
              width: { xs: '40px', sm: '60px', md: '60px' },
              height: 'auto',
              animation: 'logoAnimation 5s ease-in-out infinite',
              '@keyframes logoAnimation': {
                '0%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.1)' },
                '100%': { transform: 'scale(1)' }
              }
            }}
          />

          <Typography
            variant="h6"
            sx={{
              fontFamily: 'Arial, sans-serif',
              fontSize: { xs: '1rem', sm: '1.5rem', md: '2rem' },
              color: '#fff',
              textShadow: '0px 0px 10px rgba(255, 255, 255, 0.6)',
            }}
          >
            Matt Engineering Solutions
          </Typography>
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Arial, sans-serif',
            fontSize: { xs: '1rem', sm: '1.5rem', md: '2rem' },
            color: '#fff',
            mt: 2,
            textShadow: '0px 0px 10px rgba(255, 255, 255, 0.6)',
            animation: 'messageAnimation 3s ease-out',
            '@keyframes messageAnimation': {
              from: { opacity: 0, transform: 'translateY(20px)' },
              to: { opacity: 1, transform: 'translateY(0)' }
            }
          }}
        >
          Wishing you peace, joy, and happiness this Christmas
        </Typography>
      </Box>

      <Button
        onClick={toggleAudio}
        sx={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          backgroundColor: 'rgba(255, 255, 255, 0)',
          borderRadius: '50%',
          display:'none',
          minWidth: '48px',
          width: '48px',
          height: '48px',
          
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.0)',
          }
        }}
      >
        {isPlaying ? <Volume2 color="white" /> : <VolumeX color="white" />}
      </Button>
    </Box>
  );
};

export default FireworksWithAudioAndLogo;
