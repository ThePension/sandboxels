// Class representing a water particle
class WaterParticle extends Particle {
  constructor(x, y) {
    super(x, y, 0.5, color(50, 100, random(180, 255)));

    this.heatConductivity = 0.1;
    this.specificHeat = 1.5; // "How hard is it to heat up"
  }

  update(grid, dt) {
    if (this.updated) return;

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

    const x = this.x;
    const y = this.y;
    let gridHeight = grid.length;
    let gridWidth = grid[0].length;

    // 1. Try to move straight down
    if (y < gridHeight - 1 && grid[y + 1][x] === null) {
      this.updatePosition(grid, x, y + 1);
      this.updated = true;
      return;
    }

    // 2. Try to fall diagonally
    const dirs = [-1, 1];
    this.shuffleArray(dirs);

    for (let dir of dirs) {
      const newX = x + dir;
      const newY = y + 1;

      if (
        newX >= 0 && newX < gridWidth &&
        newY < gridHeight &&
        grid[newY][newX] === null
      ) {
        this.updatePosition(grid, newX, newY);
        this.updated = true;
        return;
      }
    }

    // 3. Try to flow sideways (only if falling wasn't possible)
    for (let dir of dirs) {
      const newX = x + dir;

      if (
        newX >= 0 && newX < gridWidth &&
        grid[y][newX] === null
      ) {
        this.updatePosition(grid, newX, y);
        this.updated = true;
        return;
      }
    }

    this.updated = true;
  }
}