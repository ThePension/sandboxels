// Class representing a sand particle
class ParticleGenerator extends SolidParticle {
  constructor(x, y, particleClass) {
    super(x, y);

    // Random Grey color for rock
    this.col = color(random(100, 150), random(100, 150), random(100, 150));
    this.density = 2.5; // Higher density for rock
    this.temperature = 20;
    this.heatConductivity = 0.07;
    this.specificHeat = 1.0; // "How hard is it to heat up"
    this.movable = false;
    this.particleClass = particleClass; // Class of the particle to generate

    this.customBehaviors.push((grid, particle, other, direction) => {
      return true;
    });
}

  update(grid, dt) {
    super.update(grid); // Call the base class update method

    // Generate rock particles below if there is no particle (AirParticle) below
    if (grid[this.y + 1] && grid[this.y + 1][this.x] instanceof AirParticle) {
      // Check if the rock can generate a new rock particle below
      if (random() < 0.05) {
        grid[this.y + 1][this.x] = new this.particleClass(this.x, this.y + 1);
      }
    }
  }
}