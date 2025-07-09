class GlassParticle extends SolidParticle {
  constructor(x, y) {
    super(x, y);

    this.updateColor();

    this.density = 1.0; // Higher density for rock
    this.temperature = 20;
    this.specificHeat = 0.8; // "How hard is it to heat up"
    this.heatConductivity = 0.05; // Very low heat conductivity for glass

    this.movable = false; // Glass is solid and does not move on its own

    // Custom behavior for glass particles when colliding with other particles
    this.customBehaviors.push((grid, particle, otherParticle) => {
      return true;
    });
  }

  update(grid, dt) {
    super.update(grid); // Call the base class update method

    // If the glass is heated enough, it can turn into a fluid
    if (this.temperature > 1700) {
      grid[this.y][this.x] = new MeltedGlassParticle(this.x, this.y);
      return;
    }

    this.updateColor();
  }

  updateColor() {
    // Base pale blue-green tone
      const base = color(100, 180, 180);

      // Create diagonal sparkle using modulo pattern
      const sparkle = (this.x + this.y * 2) % 7 === 0; // Adjust 7 for spacing
      const highlight = sparkle
        ? color(180, 255, 255) // Sparkle color (brighter)
        : base;

      this.col = highlight;
  }
}