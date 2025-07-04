// Class representing a sand particle
class RockParticle extends SolidParticle {
  constructor(x, y) {
    super(x, y);

    // Random Grey color for rock
    this.col = color(random(100, 150), random(100, 150), random(100, 150));
    this.density = 2.5; // Higher density for rock
    this.temperature = 20;
    this.updated = false;
    this.heatConductivity = 0.07;
    this.specificHeat = 1.0; // "How hard is it to heat up"

    this.customBehaviors.push((grid, particle, other, direction) => {
      if (other instanceof WaterParticle && direction === 'down') {
        // Skip some iterations to make the sand fall slower when under water
        if (random() < 0.3) {
          return true; // Skip this iteration
        }

        // There is a small chance that the sand will move diagonally when under water
        if (random() < 0.1) {
          const dx = random() < 0.5 ? -1 : 1; // Randomly choose left or right
          const newX = particle.x + dx;
          if (newX >= 0 && newX < grid[0].length && grid[particle.y + 1][newX] === null) {
            particle.updatePosition(grid, newX, particle.y + 1);
            return true;
          }
        }
      }
      return false;
    });
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