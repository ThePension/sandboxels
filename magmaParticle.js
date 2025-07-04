// Class representing a sand particle
class MagmaParticle extends SolidParticle {
  constructor(x, y) {
    super(x, y);

    // Orange/red color for magma
    this.col = color(random(200, 100), random(100, 50), random(0, 50));
    this.temperature = 2000; // High temperature for magma
    this.speed = 0.5; // Move only half the time (for a slow feel)
    this.heatConductivity = 0.1;
    this.specificHeat = 3.0; // "How hard is it to heat up"
  }

  update(grid, dt) {
    if (this.updated) return;
    
    super.update(grid); // Call the base class update method

    // If air is above, there is a small chance to generate fire
    if (grid[this.y - 1] && grid[this.y - 1][this.x] === null && this.temperature > 800 && random() < 0.01) {
      grid[this.y - 1][this.x] = new FireParticle(this.x, this.y - 1);
    }

    // If the magma cools down enough, it turns into rock
    if (this.temperature < 800) {
      grid[this.y][this.x] = new RockParticle(this.x, this.y);
      return;
    }

    this.updated = true;
  }
}