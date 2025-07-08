// Class representing a fluid particle
class FluidParticle extends Particle {
  constructor(x, y) {
    super(x, y, 0.5, color(50, 100, random(180, 255)));

    this.heatConductivity = 0.1;
    this.specificHeat = 1.5; // "How hard is it to heat up"

    this.customBehaviors = [];
  }

  update(grid, dt) {
    if (this.updated) return;
  
    super.update(grid); // Base logic: heat diffusion etc.
  
    const x = this.x;
    const y = this.y;
    const gridHeight = grid.length;
    const gridWidth = grid[0].length;
  
    // Utility to test custom behavior (like in solids)
    const tryInteraction = (targetX, targetY, direction) => {
      const target = grid[targetY]?.[targetX];
      for (let behavior of this.customBehaviors) {
        if (typeof behavior === 'function' && behavior(grid, this, target, direction)) {
          return true;
        }
      }
      return false;
    };
  
    // 1. Try to move straight down
    if (y + 1 < gridHeight) {
      if (grid[y + 1][x] === null) {
        this.updatePosition(grid, x, y + 1);
        this.updated = true;
        return;
      } else if (tryInteraction(x, y + 1, 'down')) {
        this.updated = true;
        return;
      }
    }
  
    // 2. Try to move diagonally down
    const dirs = [-1, 1];
    this.shuffleArray(dirs);
  
    for (let dir of dirs) {
      const newX = x + dir;
      const newY = y + 1;
  
      if (newX >= 0 && newX < gridWidth && newY < gridHeight) {
        const target = grid[newY][newX];
  
        if (target === null) {
          this.updatePosition(grid, newX, newY);
          this.updated = true;
          return;
        } else if (tryInteraction(newX, newY, 'diagonal')) {
          this.updated = true;
          return;
        }
      }
    }
  
    // 3. Try to move sideways
    for (let dir of dirs) {
      const newX = x + dir;
  
      if (newX >= 0 && newX < gridWidth) {
        const target = grid[y][newX];
  
        if (target === null) {
          this.updatePosition(grid, newX, y);
          this.updated = true;
          return;
        } else if (tryInteraction(newX, y, 'side')) {
          this.updated = true;
          return;
        }
      }
    }
  
    this.updated = true;
  }
  
}