// Class representing a water particle
class BedrockParticle extends Particle {
  constructor(x, y) {
    // Random dark color for bedrock
    super(x, y, 0.5, color(random(50, 100), random(50, 100), random(50, 100)));
    this.temperature = 20;
    this.heatConductivity = 1.00;
    this.specificHeat = 10000.0; // "How hard is it to heat up"

    this.movable = false;
  }

  update(grid, dt) {
    super.update(grid); // Call base particle logic (e.g., heat diffusion)
  }
}