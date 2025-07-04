class GlassParticle extends SolidParticle {
  constructor(x, y) {
    super(x, y);

    this.updateColor();

    this.density = 1.0; // Higher density for rock
    this.temperature = 20;
    this.updated = false;
    this.specificHeat = 0.8; // "How hard is it to heat up"
    this.heatConductivity = 0.05; // Very low heat conductivity for glass
  }

  update(grid, dt) {
    if (this.updated) return;

    super.update(grid); // Call the base class update method

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