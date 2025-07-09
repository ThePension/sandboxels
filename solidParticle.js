// Class representing a sand particle
class SolidParticle extends Particle {
  constructor(x, y) {
    super(x, y, 1, color(random(200, 255), random(150, 200), random(0, 100)));

    this.temperature = 40;
    this.heatConductivity = 0.05;
    this.specificHeat = 0.8; // "How hard is it to heat up"

    // List of functions, based on the particle type, that can be used to add custom behavior when colliding with other particles.
    // A function that takes the grid, the current particle, and the other particle involved in the collision.
    this.customBehaviors = [];
  }

  update(grid, dt) {
    if (this.updated) return; // Skip if already updated this frame

    super.update(grid);
  
    const x = this.x;
    const y = this.y;
    const gridH = grid.length;
    const gridW = grid[0].length;
  
    const tryInteraction = (targetX, targetY, direction) => {
      const target = grid[targetY]?.[targetX];
    
      // 1. Let this particle try reacting to the target
      for (let behavior of this.customBehaviors) {
        if (behavior(grid, this, target, direction)) return true;
      }
    
      // 2. Let the target try reacting to this one (if it has behaviors)
      if (target?.customBehaviors) {
        for (let behavior of target.customBehaviors) {
          if (behavior(grid, target, this, direction)) return true;
        }
      }
    
      return false;
    };

    if (!this.movable) return;

  
    // 1. Try straight down
    if (y + 1 < gridH) {
      if (tryInteraction(x, y + 1, 'down')) {
        return;
      } else if (grid[y + 1][x] instanceof FluidParticle) {
        if (grid[y + 1][x].density < this.density) {
          // Only swap if the fluid is less dense
          this.swap(grid, grid[y + 1][x]);
          return;
        }
      }
    }
  
    // 2. Diagonal
    let dirs = [-1, 1];
    this.shuffleArray(dirs);
    for (let dx of dirs) {
      const newX = x + dx;
      const newY = y + 1;
      if (newX >= 0 && newX < gridW && newY < gridH) {
        const target = grid[newY][newX];
        if (tryInteraction(newX, newY, 'diagonal')) return;

        if (target instanceof FluidParticle) { 
          this.swap(grid, target);
          return;
        }
      }
    }
  }
}