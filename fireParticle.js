class FireParticle extends Particle {
  constructor(x, y) {
    super(x, y, 0.1, color(random(200, 255), random(100, 150), 0)); // Bright orange color
    this.temperature = 500; // High temperature for fire
    this.speed = 0.5; // Move only half the time (for a slow feel)

    this.lifetime = 1000; // Fire particles last for a limited time
    this.updated = false; // Track if this particle has been updated
  }

  update(grid, dt) {
    if (this.updated) return;
    if (random() > this.speed) return;

    // Call base particle logic (e.g., heat diffusion)
    super.update(grid);

    // Check for burning out
    if (this.lifetime <= 0) {
      grid[this.y][this.x] = null; // Remove fire particle when it burns out
      return;
    }

    this.lifetime -= dt; // Decrease lifetime based on delta time

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

        if (target === null || target === null) {
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
