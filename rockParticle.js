// Class representing a sand particle
class RockParticle extends SandParticle {
  constructor(x, y) {
    super(x, y);

    // Random Grey color for rock
    this.col = color(random(100, 150), random(100, 150), random(100, 150));
    this.density = 2.5; // Higher density for rock
    this.temperature = 20;
    this.updated = false;
    this.heatConductivity = 0.07;
    this.specificHeat = 1.0; // "How hard is it to heat up"
  }

  update(grid, dt) {
    if (this.updated) return;

    super.update(grid); // Call the base class update method

    // If the rock is heated enough, it can turn into magma
    if (this.temperature > 800 && random() < 0.05) {
      grid[this.y][this.x] = new MagmaParticle(this.x, this.y);
      return;
    }
  }
}