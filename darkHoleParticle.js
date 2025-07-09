// Class representing a water particle
class DarkHoleParticle extends SolidParticle {
  constructor(x, y) {
    // Random dark color for dark hole
    super(x, y, 0.5, color(random(0, 50), random(0, 50), random(0, 50)));
    this.col = color(random(0, 50), random(0, 50), random(0, 50));
    this.temperature = 0; // Dark hole temperature
    this.heatConductivity = 0.0;
    this.specificHeat = 1; // "How hard is it to heat up"

    this.movable = false;

    // Custom behavior for ice particles when colliding with other particles
    this.customBehaviors.push((grid, particle, otherParticle) => {
      this.updated = true; // Mark as updated for this frame

      // Dark hole particles can absorb other particles
      if (otherParticle instanceof Particle) {
        // Replace the other particle with an AirParticle in the grid
        grid[otherParticle.y][otherParticle.x] = new AirParticle(otherParticle.x, otherParticle.y);
        // otherParticle.updated = true; // Mark the absorbed particle as updated
        return true; // Indicate that the dark hole absorbed the particle
      }
      return false; // No absorption occurred
    });
  }

  update(grid, dt) {
    super.update(grid); // Call base particle logic (e.g., heat diffusion)
  }
}