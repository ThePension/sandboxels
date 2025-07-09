class AirParticle extends FluidParticle {
  constructor(x, y) {
    super(x, y, 0.000026, color(200, 200, random(180, 255)));
    this.temperature = 20;
    this.density = 0.0012; // Density of air at room temperature
    this.heatConductivity = 0.0001; // Heat conductivity of air
    this.specificHeat = 0.01; // Specific heat of air at constant pressure
  }

  update(grid, dt) {
    // Call base particle logic (e.g., heat diffusion)
    super.update(grid);
  }

  // Override direction-specific logic from FluidParticle
  getMovementDirections() {
    // Return direction priorities: upward, diagonal-up, sideways
    return [];
  }
}
