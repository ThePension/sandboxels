// Class representing a sand particle
class SandParticle extends Particle {
  constructor(x, y) {
    super(x, y, 1, color(random(200, 255), random(150, 200), random(0, 100)));

    this.isWet = false; // Flag to indicate if this particle is wet

    this.temperature = 40;
    this.heatConductivity = 0.05;
    this.specificHeat = 0.8; // "How hard is it to heat up"
  }

  update(grid, dt) {
    if (this.updated) return;

    super.update(grid); // Call the base class update method

    // If the sand is heated enough, it can turn into glass
    // if (this.temperature > 1700 && random() < 0.01) {
    //   grid[this.y][this.x] = new GlassParticle(this.x, this.y);
    //   return;
    // }
  
    let x = this.x;
    let y = this.y;
    let gridHeight = grid.length;
    let gridWidth = grid[0].length;
  
    // 1. Try to fall straight down
    if (y < gridHeight - 1) {
      let below = grid[y + 1][x];
  
      if (below === null) {
        this.updatePosition(grid, x, y + 1);
        return;
      }
  
      // 2. If falling onto water
      if (below instanceof WaterParticle) {
        // Random chance to absorb water and become wet
        if (random() > 0.95 && !this.isWet) {
          grid[y + 1][x] = null; // Clear the water particle
          this.updatePosition(grid, x, y + 1);
          this.col = color(random(100, 150), random(50, 100), random(0, 50));
          this.isWet = true;
          return;
        }
  
        if (random() > 0.5) {
          // Otherwise, swap
          this.swap(grid, below);
          return;
        }
      }
    }
  
    // 3. Try to fall diagonally (left or right)
    let dirs = [-1, 1];
    this.shuffleArray(dirs);
    for (let dir of dirs) {
      let newX = x + dir;
      let newY = y + 1;
      if (
        newX >= 0 &&
        newX < gridWidth &&
        newY < gridHeight
      ) {
        let target = grid[newY][newX];

        // If the sand is above a solid block, there is a small chance that sand will not fall diagonally and keep its position
        // if (random() < 0.1) {
        //   return; // 10% chance to keep its position
        // }

        // Allow sand to fall diagonally into water
        if (target instanceof WaterParticle) {
            // Random chance to absorb water and become wet
          if (random() > 0.95 && !this.isWet) {
            grid[y + 1][x] = null; // Clear the water particle
            this.updatePosition(grid, x, y + 1);
            this.col = color(random(100, 150), random(50, 100), random(0, 50));
            this.isWet = true;
            return;
          }
          else {
            // Otherwise, swap
            this.swap(grid, target);
            return;
          }
        }

        // If the target is empty, move there
        if (target === null) {
          this.updatePosition(grid, newX, newY);
          return;
        }
      }
    }
  
    this.updated = true;
  }
}