'use client';

import { useCallback } from 'react';
import { loadSlim } from 'tsparticles-slim';
import { Engine } from 'tsparticles-engine';
import Particles from 'react-tsparticles';

export default function ParticleBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: {
            value: 'transparent',
          },
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: 'push',
            },
            onHover: {
              enable: true,
              mode: 'repulse',
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 6,
            },
            repulse: {
              distance: 150,
              duration: 0.3,
            },
          },
        },
        particles: {
          color: {
            value: ['#f5f5f5', '#d4d4d4', '#cd853f', '#daa520', '#ffd700', '#b8860b'],
          },
          links: {
            color: '#daa520',
            distance: 150,
            enable: true,
            opacity: 0.4,
            width: 1.2,
          },
          move: {
            direction: 'none',
            enable: true,
            outModes: {
              default: 'bounce',
            },
            random: false,
            speed: 0.8,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 60,
          },
          opacity: {
            value: 0.8,
          },
          shape: {
            type: 'circle',
          },
          twinkle: {
            particles: {
              enable: true,
              color: '#ffd700',
              frequency: 0.05,
              opacity: 1,
            },
          },
          size: {
            value: { min: 1, max: 3 },
          },
        },
        detectRetina: true,
      }}
      className="absolute inset-0 z-10"
    />
  );
}
