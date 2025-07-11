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
  
    super.update(grid); // Base particle logic: heat diffusion etc.
  
    const x = this.x;
    const y = this.y;
    const gridHeight = grid.length;
    const gridWidth = grid[0].length;
  
    // Utility for handling interactions between particles
    const tryInteraction = (targetX, targetY, direction) => {
      const target = grid[targetY]?.[targetX];
      
      // 1. This particle reacts to the target
      for (let behavior of this.customBehaviors) {
        if (behavior(grid, this, target, direction)) return true;
      }
  
      // 2. The target reacts to this particle
      if (target?.customBehaviors) {
        for (let behavior of target.customBehaviors) {
          if (behavior(grid, target, this, direction)) return true;
        }
      }
  
      return false;
    };
  
    // Allow subclasses to override movement priority
    const directions = this.getMovementDirections?.() || [
      { dx: 0, dy: 1, dir: "down" },       // Down
      { dx: -1, dy: 1, dir: "diagonal" },  // Down-left
      { dx: 1, dy: 1, dir: "diagonal" },   // Down-right
      { dx: -1, dy: 0, dir: "side" },      // Left
      { dx: 1, dy: 0, dir: "side" }        // Right
    ];

    // Shuffle directions to add randomness
    this.shuffleArray(directions);
  
    this.updated = true; // Mark as processed this frame

    // Try each movement direction in order
    for (let { dx, dy, dir } of directions) {
      const newX = x + dx;
      const newY = y + dy;
  
      if (
        newX >= 0 && newX < gridWidth &&
        newY >= 0 && newY < gridHeight
      ) {
        const target = grid[newY][newX];
  
        if (target === null || target instanceof AirParticle) {
          this.updatePosition(grid, newX, newY);
          return;
        } else if (tryInteraction(newX, newY, dir)) {
          return;
        } else if (target instanceof FluidParticle) {
          // If the target is another fluid, swap positions
          if (target.density < this.density) {
            // Only swap if the target is less dense
            this.swap(grid, target);
            return;
          }
        }
      }
    }
  
    this.updated = true; // Mark as processed this frame
  } 
}