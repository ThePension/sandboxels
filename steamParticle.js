class SteamParticle extends Particle {
  constructor(x, y) {
    super(x, y, 0.0184, color(200, 200, random(180, 255)));
    this.speed = 0.5; // Move only half the time (for a slow feel)
    this.temperature = 110; // Steam is at 100 degrees Celsius

    this.heatConductivity = 0.005;
    this.specificHeat = 2.0; // "How hard is it to heat up"
  }

  update(grid, dt) {
    if (this.updated) return;
    if (random() > this.speed) return;

    // Call base particle logic (e.g., heat diffusion)
    super.update(grid);

    // Check for condensation
    if (this.temperature < 100) {
      grid[this.y][this.x] = new WaterParticle(this.x, this.y);
      return;
    }

    const x = this.x;
    const y = this.y;
    let gridHeight = grid.length;
    let gridWidth = grid[0].length;

    // 1. Try to rise into empty space
    if (y > 0 && grid[y - 1][x] === null) {
      this.updatePosition(grid, x, y - 1);
      this.updated = true;
      return;
    }

    // 2. Try to rise into a heavier particle (e.g. water)
    if (y > 0 && grid[y - 1][x] instanceof Particle) {
      let target = grid[y - 1][x];
      if (target.density > this.density) {
        this.swap(grid, target); // Move steam up, bring water down
        this.updated = true;
        return;
      }
    }

    // 3. Try to rise diagonally
    const dirs = [-1, 1];
    this.shuffleArray(dirs);

    for (let dir of dirs) {
      const newX = x + dir;
      const newY = y - 1;

      if (newX >= 0 && newX < gridWidth && newY >= 0) {
        let target = grid[newY][newX];

        if (target === null) {
          this.updatePosition(grid, newX, newY);
          this.updated = true;
          return;
        }

        if (target instanceof Particle && target.density > this.density) {
          this.swap(grid, target);
          this.updated = true;
          return;
        }
      }
    }

    // 4. Try to move sideways into air only (no compacting)
    for (let dir of dirs) {
      const newX = x + dir;

      if (newX >= 0 && newX < gridWidth && grid[y][newX] === null) {
        this.updatePosition(grid, newX, y);
        this.updated = true;
        return;
      }
    }

    this.updated = true;
  }
}
