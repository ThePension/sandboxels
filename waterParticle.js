// Class representing a water particle
class WaterParticle extends FluidParticle {
  constructor(x, y) {
    super(x, y, 0.5, color(50, 100, random(180, 255)));

    this.heatConductivity = 0.1;
    this.specificHeat = 1.5; // "How hard is it to heat up"
  }

  update(grid, dt) {
    super.update(grid); // Call base particle logic (e.g., heat diffusion)

    // Check for evaporation
    if (this.temperature > 100) {
      grid[this.y][this.x] = new SteamParticle(this.x, this.y);
      return;
    }

    // Check for freezing
    if (this.temperature < 0) {
      grid[this.y][this.x] = new IceParticle(this.x, this.y);
      return;
    }
  }
}