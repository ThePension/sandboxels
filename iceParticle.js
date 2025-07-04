// Class representing a water particle
class IceParticle extends SolidParticle {
  constructor(x, y) {
    // Random light blue color for ice
    super(x, y, 0.5, color(random(200, 255), random(200, 255), random(255, 255)));
    this.col = color(random(200, 255), random(200, 255), random(255, 255));
    this.temperature = -20; // Ice is at 0 degrees Celsius
    this.updated = false; // Track if this particle has been updated
    this.heatConductivity = 0.02;
    this.specificHeat = 2.0; // "How hard is it to heat up"

    this.movable = false;

    // Custom behavior for ice particles when colliding with other particles
    this.customBehaviors.push((grid, particle, otherParticle) => {
      return true;
    });
  }

  update(grid, dt) {
    if (this.updated) return;

    super.update(grid); // Call base particle logic (e.g., heat diffusion)

    if (this.temperature > 2) {
      grid[this.y][this.x] = new WaterParticle(this.x, this.y);
      return; // Ice melts into water
    }

    this.updated = true;
  }
}