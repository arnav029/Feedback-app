'use client'

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import messages from '@/messages.json';

const MovingBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // Early return if canvas is null

    const ctx = canvas.getContext('2d');
    if (!ctx) return; // Early return if context is null

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles: Array<{x: number; y: number; radius: number; speed: number}> = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        speed: Math.random() * 0.5 + 0.1,
      });
    }

    function animate() {
      if (!canvas || !ctx) return;
      
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fill();

        particle.y -= particle.speed;
        if (particle.y < 0) {
          particle.y = canvas.height;
        }
      });
    }

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ filter: 'blur(4px)' }}
    />
  );
};

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gray-900 text-white flex flex-col overflow-hidden">
      <MovingBackground />
      <div className="relative z-10 flex flex-col flex-grow">

        {/* Main content */}
        <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
          <section className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in-up">
              Explore the Realm of Unseen Feedback
            </h1>
            <p className="text-xl md:text-2xl mb-8 animate-fade-in-up animation-delay-300">
              WhisperBox: Hear the whispers that shape your world.
            </p>
          </section>

          {/* Carousel */}
          <Carousel
            className="w-full max-w-3xl mx-auto bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg shadow-xl animate-fade-in-up animation-delay-900"
            plugins={[Autoplay({ delay: 2000 })]}
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-6">
                  <Card className="bg-transparent border-none">
                    <CardHeader>
                      <CardTitle className="text-2xl font-semibold text-gray-300">{message.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-start space-x-4 text-gray-500">
                      <Mail className="flex-shrink-0 text-gray-300" size={24} />
                      <div>
                        <p className="text-lg">{message.content}</p>
                        <p className="text-sm text-gray-400 mt-2">{message.received}</p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </main>

        {/* Footer */}
        <footer className="text-center p-6 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg mt-auto">
          <p>© 2024 WhisperBox. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}