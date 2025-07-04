class GlassParticle extends SandParticle {
  constructor(x, y) {
    super(x, y);

    // Random whitish color for glass
    this.col = color(random(200, 255), random(200, 255), random(200, 255));
    // Opacity for glass effect
    this.col.setAlpha(150); // Semi-transparent


    this.density = 1.0; // Higher density for rock
    this.temperature = 20;
    this.updated = false;
    this.heatConductivity = 0.0001; // Very low heat conductivity for glass
  }

  update(grid, dt) {
    if (this.updated) return;

    super.update(grid); // Call the base class update method
  }
}