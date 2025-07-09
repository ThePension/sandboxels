// Class representing a sand particle
class SandParticle extends SolidParticle {
  constructor(x, y) {
    super(x, y, 1, color(random(200, 255), random(150, 200), random(0, 100)));

    this.isWet = false; // Flag to indicate if this particle is wet

    this.temperature = 40;
    this.heatConductivity = 0.05;
    this.specificHeat = 0.8; // "How hard is it to heat up"

    this.customBehaviors.push((grid, particle, other, direction) => {
      if (other instanceof WaterParticle && direction === 'down') {
        // Skip some iterations to make the sand fall slower when under water
        if (random() < 0.5) {
          return true; // Skip this iteration
        }

        if (random() > 0.95 && !particle.isWet && grid[particle.y + 1]) {
          // Swap the sand with water
          this.swap(grid, grid[particle.y + 1][particle.x]);
          particle.col = color(random(100, 150), random(50, 100), random(0, 50));
          particle.isWet = true;
          return true;
        }

        // There is a small chance that the sand will move diagonally when under water
        if (random() < 0.5) {
          const dx = random() < 0.5 ? -1 : 1; // Randomly choose left or right
          const newX = particle.x + dx;
          if (newX >= 0 && newX < grid[0].length && grid[particle.y + 1]?.[newX] === null) {
            this.swap(grid, grid[particle.y + 1][newX]);
            return true;
          }
        }
      }
      return false;
    });
    
  }

  update(grid, dt) {
    super.update(grid); // Call the base class update method

    // If the sand is heated enough, it can turn into glass
    if (this.temperature > 1700 && random() < 0.01) {
      grid[this.y][this.x] = new GlassParticle(this.x, this.y);
      return;
    }
  }
}