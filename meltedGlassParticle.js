// Class representing a sand particle
class MeltedGlassParticle extends FluidParticle {
  constructor(x, y) {
    super(x, y);

    // Orange/red color for magma
    this.col = color(random(200, 100), random(100, 50), random(0, 50));
    this.temperature = 2000; // High temperature for magma
    this.speed = 0.5; // Move only half the time (for a slow feel)
    this.heatConductivity = 0.1;
    this.specificHeat = 3.0; // "How hard is it to heat up"

    this.customBehaviors.push((grid, particle, other, direction) => {
      // Skip some iterations to make the magma fall diagonally slower
      if ((direction === 'diagonal'|| direction === 'side') && random() < 0.9) {
        return true; // Skip this iteration
      }
    });
  }

  update(grid, dt) {
    
    super.update(grid); // Call the base class update method

    // If the melted class cools down enough, it turns into glass
    if (this.temperature < 800) {
      grid[this.y][this.x] = new GlassParticle(this.x, this.y);
      return;
    }

    this.updateColor();
  }

  updateColor() {
    // Base pale orange-yellow, based on the temperature
      const base = color(
        map(this.temperature, 0, 2500, 100, 200), // Adjust color based on temperature
        map(this.temperature, 0, 2500, 50, 150),
        map(this.temperature, 0, 2500, 0, 50)
      );

      // Create diagonal sparkle using modulo pattern
      const sparkle = (this.x + this.y * 2) % 7 === 0; // Adjust 7 for spacing
      const highlight = sparkle
        ? color(
            map(this.temperature, 0, 2500, 180, 255), // Brighter highlight based on temperature
            map(this.temperature, 0, 2500, 100, 255),
            map(this.temperature, 0, 2500, 50, 150)
          ) // Sparkle color (brighter)
        : base;

      this.col = highlight;
  }
}