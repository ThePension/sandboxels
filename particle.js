// Class representing a sand particle
class Particle {
  constructor(x, y, density, col) {
    this.x = x;
    this.y = y;
    this.density = density || 1; // Default density for sand

    this.updated = false; // Flag to track if the particle has been updated
    this.col = col;

    this.temperature = 20; // Default temperature
    this.heatConductivity = 0.1; // How easily this material transfers heat
    this.mass = 1.0; // Mass of the particle, used for heat calculations
    this.specificHeat = 1.0; // "How hard is it to heat up"

    this.movable = true; // Flag to indicate if the particle can move
  }

  getHeatCapacity() {
    return this.mass * this.specificHeat;
  }

  show() {
    fill(this.col);
    noStroke();
    rect(this.x * particleSize, this.y * particleSize, particleSize, particleSize);
  }

  update(grid) {
    // To override in subclasses

    // Cool down towards ambient temperature
    // let ambient = 20; // Ambient temperature
    // this.temperature = lerp(this.temperature, ambient, 0.0001); // slow decay

    this.diffuseHeat(grid); // Diffuse heat with neighbors
  }

  shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  swap(grid, otherParticle) {
    if (otherParticle.movable === false) {
      return; // Cannot swap with a non-movable particle
    }

    let tempX = this.x;
    let tempY = this.y;

    this.x = otherParticle.x;
    this.y = otherParticle.y;

    otherParticle.x = tempX;
    otherParticle.y = tempY;

    grid[this.y][this.x] = this;
    grid[otherParticle.y][otherParticle.x] = otherParticle;
  }

  updatePosition(grid, newX, newY) {
    if (newX >= 0 && newX < grid[0].length && newY >= 0 && newY < grid.length) {
      grid[newY][newX] = this;
      grid[this.y][this.x] = null; // Replace current position with AirParticle
      this.x = newX; // Update the particle's x position
      this.y = newY; // Update the particle's y position
    }
  }

  diffuseHeat(grid) {
    for (let [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
      let nx = this.x + dx;
      let ny = this.y + dy;
  
      if (nx >= 0 && nx < grid[0].length && ny >= 0 && ny < grid.length) {
        let neighbor = grid[ny][nx];
        if (neighbor && neighbor instanceof Particle) {
          this.exchangeHeatWith(neighbor);
        }
      }
    }
  }
  

  exchangeHeatWith(neighbor) {
    const T1 = this.temperature;
    const T2 = neighbor.temperature;
  
    const k = Math.min(this.heatConductivity, neighbor.heatConductivity);
    const Q = k * (T1 - T2); // Simplified Fourier’s Law
  
    const c1 = this.getHeatCapacity();
    const c2 = neighbor.getHeatCapacity();
  
    // Update temperatures based on heat exchanged
    this.temperature -= Q / c1;
    neighbor.temperature += Q / c2;

    // console.log(`Exchanged heat: ${Q}, New temperatures: ${this.temperature}, ${neighbor.temperature}`);
  }
}