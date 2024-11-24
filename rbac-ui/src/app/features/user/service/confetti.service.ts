import { Injectable } from '@angular/core';
import confetti from 'canvas-confetti';

@Injectable({
  providedIn: 'root',
})
export class ConfettiService {
  launchConfetti(): void {
	confetti({
		particleCount: 200,
		spread: 120, // Wider spread
		startVelocity: 30, // Speed of particles
		colors: ['#f54291', '#42f54b', '#42aaf5'], // Custom colors
		scalar: 1.2, // Size of the confetti particles
	      });	      
  }

  launchCelebration(): void {
    const end = Date.now() + 2 * 1000; // Duration of the celebration

    const colors = ['#bb0000', '#ffffff']; // Confetti colors

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 }, // Left side of the screen
        colors,
      });

      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 }, // Right side of the screen
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }
}
