class AirParticle extends Particle {
  constructor(x, y) {
    super(x, y, 0.000026, color(200, 200, random(180, 255)));
    this.temperature = 20; // Steam is at 100 degrees Celsius
    this.density = 0.0012; // Density of air at room temperature
  }

  update(grid, dt) {
    if (this.updated) return;

    // Call base particle logic (e.g., heat diffusion)
    super.update(grid);

    this.updated = true;
  }
}
