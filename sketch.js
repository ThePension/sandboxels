let grid = [];

const gridHeight = 120;
const gridWidth = 200; // Size of the grid (100x100)

let particleSize = 5; // Size of each sand particle

const temperatureDisplay = document.getElementById("temperature");
const selectElement = document.getElementById("particle-select");
const brushSizeInput = document.getElementById("brush-size");

function setup() {
  createCanvas(1000, 600);

  frameRate(30); // Set frame rate to 30 FPS

  // particleSize = width / gridSize; // Adjust sand size based on grid size

  for (let i = 0; i < gridHeight; i++) {
    grid[i] = [];
    for (let j = 0; j < gridWidth; j++) {
      grid[i][j] = null; // new AirParticle(j, i); // Initialize grid with AirParticles values
    }
  }
}

function draw() {

  if (isMouseHeld) {
    let x = Math.floor(mouseX / particleSize);
    let y = Math.floor(mouseY / particleSize);

    handleParticleInteraction(x, y); // Ensure particles are added even if not dragged
  }


  background(220);
  updateGrid(deltaTime); // Update the grid state
  drawGrid();

  updateTemperatureDisplay(); // Update temperature display continuously

}

function updateGrid(deltaTime) {
  let speed = Math.floor(deltaTime / 16);
  speed = constrain(speed, 1, 5);

  for (let step = 0; step < speed; step++) {
    // Loop through the grid and update each cell
    for (let y = gridHeight - 1; y >= 0; y--) {
      for (let x = 0; x < gridWidth; x++) {
        let particle = grid[y][x];

        if (!particle) continue; // Skip empty cells

        particle.update(grid, deltaTime);

      }
    }

    // Reset the updated flag for all particles
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        let particle = grid[y][x];
        if (particle) {
          particle.updated = false; // Reset the updated flag
        }
      }
    }
  }
}


// Function to add sand at a specific position
function addParticle(x, y, type = "sand") {
  let brushSize = parseInt(brushSizeInput.value) || 1; // Get brush size from input
  for (let i = -brushSize; i <= brushSize; i++) {
    for (let j = -brushSize; j <= brushSize; j++) {
      let nx = x + i;
      let ny = y + j;
      if (
        nx >= 0 && nx < gridWidth &&
        ny >= 0 && ny < gridHeight &&
        grid[ny][nx] === null // Only add particles to empty cells
      ) {
        if (type === "sand") {
          let randomColor = color(random(200, 255), random(150, 200), random(0, 50));
          grid[ny][nx] = new SandParticle(nx, ny, randomColor);
        }
        else if (type === "water") {
          let blue = color(50, 100, random(180, 255));
          grid[ny][nx] = new WaterParticle(nx, ny, blue);
        }
        else if (type === "magma") {
          grid[ny][nx] = new MagmaParticle(nx, ny);
        }
        else if (type === "ice") {
          grid[ny][nx] = new IceParticle(nx, ny);
        }
        else if (type === "rock") {
          grid[ny][nx] = new RockParticle(nx, ny);
        }
        else if (type === "glass") {
          grid[ny][nx] = new GlassParticle(nx, ny);
        }
        else if (type === "bedrock") {
          grid[ny][nx] = new BedrockParticle(nx, ny);
        }
        else if (type === "fire") {
          grid[ny][nx] = new FireParticle(nx, ny);
        }
      }
    }
  }
}

// Function to erase particles at a specific position
function eraseParticle(x, y) {
  let brushSize = parseInt(brushSizeInput.value) || 1; // Get brush size from input
  for (let i = -brushSize; i <= brushSize; i++) {
    for (let j = -brushSize; j <= brushSize; j++) {
      let nx = x + i;
      let ny = y + j;
      if (
        nx >= 0 && nx < gridWidth &&
        ny >= 0 && ny < gridHeight &&
        grid[ny][nx] !== null
      ) {
        grid[ny][nx] = null; // Replace with AirParticle
      }
    }
  }
}

// Function to cool down particles
function coolDownParticles(x, y) {
  let brushSize = parseInt(brushSizeInput.value) || 1; // Get brush size from input
  for (let i = -brushSize; i <= brushSize; i++) {
    for (let j = -brushSize; j <= brushSize; j++) {
      let nx = x + i;
      let ny = y + j;
      if (
        nx >= 0 && nx < gridWidth &&
        ny >= 0 && ny < gridHeight &&
        grid[ny][nx] !== null
      ) {
        let particle = grid[ny][nx];
        if (particle.temperature !== undefined) {
          particle.temperature -= 100; // Cool down the particle
        }
      }
    }
  }
}

function heatUpParticles(x, y) {
  let brushSize = parseInt(brushSizeInput.value) || 1; // Get brush size from input
  for (let i = -brushSize; i <= brushSize; i++) {
    for (let j = -brushSize; j <= brushSize; j++) {
      let nx = x + i;
      let ny = y + j;
      if (
        nx >= 0 && nx < gridWidth &&
        ny >= 0 && ny < gridHeight &&
        grid[ny][nx] !== null
      ) {
        let particle = grid[ny][nx];
        if (particle.temperature !== undefined) {
          particle.temperature += 1000; // Heat up the particle
        }
      }
    }
  }
}

// Check mouse position and add sand
let isMouseHeld = false;

function mouseDragged() {
  let x = Math.floor(mouseX / particleSize);
  let y = Math.floor(mouseY / particleSize);

  handleParticleInteraction(x, y);
}

function mousePressed() {
  isMouseHeld = true;
  let x = Math.floor(mouseX / particleSize);
  let y = Math.floor(mouseY / particleSize);

  handleParticleInteraction(x, y); // Add particle on initial press
}

function mouseReleased() {
  isMouseHeld = false;
}

function handleParticleInteraction(x, y) {
  if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) {
    // Based on the selected particle type
    let selectedType = selectElement.value;
    if (selectedType === "sand") {
      addParticle(x, y, "sand");
    } else if (selectedType === "water") {
      addParticle(x, y, "water");
    } else if (selectedType === "magma") {
      addParticle(x, y, "magma");
    } else if (selectedType === "ice") {
      addParticle(x, y, "ice");
    } else if (selectedType === "rock") {
      addParticle(x, y, "rock");

    } else if (selectedType === "glass") {
      addParticle(x, y, "glass");
    } else if (selectedType === "bedrock") {
      addParticle(x, y, "bedrock");
    } else if (selectedType === "fire") {
      addParticle(x, y, "fire");
    } else if (selectedType === "cooler") {
      coolDownParticles(x, y);
    } else if (selectedType === "eraser") {
      eraseParticle(x, y);
    } else if (selectedType === "heater") {
      heatUpParticles(x, y);
    }
  }
}

// Function to display temperature at the top right corner, outside the grid
function displayTemperature(x, y) {
  let particle = grid[y][x];
  if (particle && particle.temperature !== undefined) {
    temperatureDisplay.innerText = `Temperature at (${x}, ${y}): ${particle.temperature}°C`;
  } else {
    temperatureDisplay.innerText = "Temperature:"; // Clear temperature display if out of bounds
  }
}

function updateTemperatureDisplay() {
  let x = Math.floor(mouseX / particleSize);
  let y = Math.floor(mouseY / particleSize);

  if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) {
    displayTemperature(x, y);
  } 
}

// Function to draw the grid
function drawGrid() {
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      let particle = grid[y][x];

      if (!particle) continue; // Skip empty cells

      if (particle === null) {
        continue;
      }

      particle.show();
    }
  }
}