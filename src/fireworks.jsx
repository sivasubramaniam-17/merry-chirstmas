import { useEffect, useRef } from 'react';

const Fireworks = () => {
  const canvasRef = useRef(null);
  const firecrackerAudio = useRef(null);

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

    const logo = new Image();
    logo.src = '/logo.png';
    const santaHat = new Image();
    // santaHat.src = '/santa-hat.png';

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
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
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

    let textOpacity = 0;
    const animateText = () => {
      textOpacity = Math.min(textOpacity + 0.01, 1);

      const screenWidth = canvas.width / (window.devicePixelRatio || 1);
      const centerX = screenWidth / 2;

      // Draw "Merry Christmas!"
      const christmasText = 'Merry Christmas!';
      const baseFontSize = Math.min(screenWidth / 10, 70);  // Adjust baseFontSize for mobile screens
      ctx.font = `${baseFontSize}px 'Dancing Script', cursive`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';

      const christmasY = canvas.height / 3;
      const christmasMetrics = ctx.measureText(christmasText);

      ctx.fillStyle = `rgba(255, 223, 0, ${textOpacity})`;
      ctx.fillText(christmasText, centerX, christmasY);

      // Draw Santa Hat precisely on 'M'
      if (textOpacity === 1 && santaHat.complete) {
        const leftTextEdge = centerX - christmasMetrics.width / 2;
        const hatWidth = baseFontSize * 0.7;
        const hatHeight = hatWidth;
        const hatX = leftTextEdge - hatWidth * 0.2;  // Adjust for better positioning
        const hatY = christmasY - baseFontSize * 0.7;

        ctx.drawImage(santaHat, hatX, hatY, hatWidth, hatHeight);
      }

      // Draw company name with exact center alignment
      const companyText = 'Matt Engineering Solutions';
      const subFontSize = Math.min(screenWidth / 25, 40); // Adjust subFontSize for better mobile display

      ctx.font = `${subFontSize}px Arial`;
      ctx.fillStyle = `rgba(255, 255, 255, ${textOpacity})`;
      ctx.textBaseline = 'middle';

      const companyY = canvas.height * 0.7;
      const companyMetrics = ctx.measureText(companyText);

      // Ensure exact center alignment for company name
      const companyX = Math.round(centerX);
      ctx.fillText(companyText, companyX, companyY);

      // Draw Logo
      if (logo.complete) {
        const logoSize = subFontSize * 1.5;
        const logoX = companyX - companyMetrics.width / 2 - logoSize - 10;
        const logoY = companyY - logoSize / 2;
        ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      generateSnowflakes();
      drawSnowflakes();
      drawFireworks();

      if (Math.random() < 0.05) {
        createFirework(Math.random() * canvas.width, Math.random() * canvas.height / 2);
      }

      animateText();
      requestAnimationFrame(animate);
    };

    firecrackerAudio.current = new Audio('/firecraker.mp3');
    firecrackerAudio.current.loop = true;
    firecrackerAudio.current.play().catch(() => console.error('Failed to play audio.'));

    animate();

    return () => {
      firecrackerAudio.current.pause();
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100vh',padding:"0" }} />;
};

export default Fireworks;
