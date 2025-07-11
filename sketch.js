let grid = [];

const gridHeight = 120;
const gridWidth = 150;

let particleSize = 5; // Size of each sand particle

const temperatureDisplay = document.getElementById("temperature");
const selectElement = document.getElementById("particle-select");
const brushSizeInput = document.getElementById("brush-size");
const fpsLabel = document.getElementById("fps");

// Export function, that can be used to export the grid state as json
function exportGrid() {
  const gridData = grid.map(row =>
    row.map(particle =>
      particle
        ? {
            type: particle.constructor.name,
            x: particle.x,
            y: particle.y,
            temperature: particle.temperature ?? null,
            col: particle.col?.levels ?? null, // p5.js color
            extra: particle.toJSON ? particle.toJSON() : null
          }
        : null
    )
  );

  const json = JSON.stringify(gridData, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "grid_export.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importGrid() {
  const input = document.getElementById("import-input");
  const file = input.files[0];

  if (!file) {
    alert("Please select a file first.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    try {
      const jsonData = event.target.result;
      const gridData = JSON.parse(jsonData);
      const newGrid = [];

      for (let y = 0; y < gridData.length; y++) {
        newGrid[y] = [];
        for (let x = 0; x < gridData[y].length; x++) {
          const cell = gridData[y][x];
          if (!cell) {
            newGrid[y][x] = null;
            continue;
          }

          const particle = particleFactory(cell.type, x, y, cell.extra);
          if (particle) {
            if (cell.temperature !== undefined) particle.temperature = cell.temperature;
            if (cell.col) particle.col = color(...cell.col);
            newGrid[y][x] = particle;
          } else {
            newGrid[y][x] = null;
          }
        }
      }

      grid = newGrid;
    } catch (e) {
      console.error("Error parsing JSON:", e);
      alert("Invalid or corrupted file.");
    }
  };

  reader.readAsText(file);
}


function particleFactory(type, x, y, extra) {
  switch (type) {
    case "SandParticle": return new SandParticle(x, y);
    case "WaterParticle": return new WaterParticle(x, y);
    case "SteamParticle": return new SteamParticle(x, y);
    case "GlassParticle": return new GlassParticle(x, y);
    case "FireParticle": return new FireParticle(x, y);
    case "AirParticle": return new AirParticle(x, y);
    case "DarkHoleParticle": return new DarkHoleParticle(x, y);
    case "MagmaParticle": return new MagmaParticle(x, y);
    case "IceParticle": return new IceParticle(x, y);
    case "RockParticle": return new RockParticle(x, y);
    case "MeltedGlassParticle": return new MeltedGlassParticle(x, y);
    case "BedrockParticle": return new BedrockParticle(x, y);
    case "RockParticleGenerator": return new RockParticleGenerator(x, y);

    // Add other particles here...
    default: return null;
  }
}


// Enum for particle types
const ParticleType = {
  SAND: "sand",
  WATER: "water",
  MAGMA: "magma",
  ICE: "ice",
  ROCK: "rock",
  GLASS: "glass",
  MELTED_GLASS: "meltedGlass",
  BEDROCK: "bedrock",
  FIRE: "fire",
  COOLER: "cooler",
  ERASER: "eraser",
  HEATER: "heater",
  DARK_HOLE: "darkHole",
  WATER_GENERATOR: "waterGenerator",
};

function setup() {
  createCanvas(750, 600);

  frameRate(30); // Set frame rate to 30 FPS

  for (let i = 0; i < gridHeight; i++) {
    grid[i] = [];
    for (let j = 0; j < gridWidth; j++) {
      grid[i][j] = new AirParticle(j, i); // Initialize grid with AirParticles values
    }
  }
}

function draw() {

  if (isMouseHeld) {
    let x = Math.floor(mouseX / particleSize);
    let y = Math.floor(mouseY / particleSize);

    handleParticleInteraction(x, y); // Ensure particles are added even if not dragged
  }

  background(0);
  updateGrid(deltaTime); // Update the grid state
  drawGrid();

  updateTemperatureDisplay(); // Update temperature display continuously

  fpsLabel.innerText = `FPS: ${Math.round(frameRate())}`;

  // Draw a rectangle at the mouse position, based on the brush size
  let mouseXGrid = Math.floor(mouseX / particleSize);
  let mouseYGrid = Math.floor(mouseY / particleSize);
  let brushSize = parseInt(brushSizeInput.value) || 1; // Get brush size from input
  
  noFill();
  stroke(255, 200); // Semi-transparent stroke for the brush
  strokeWeight(1);
  rect(mouseXGrid * particleSize - brushSize * particleSize,
       mouseYGrid * particleSize - brushSize * particleSize,
       (brushSize * 2 + 1) * particleSize,
       (brushSize * 2 + 1) * particleSize);
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

    // Reset the updated flag for the next frame
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        let particle = grid[y][x];
        if (particle) {
          particle.updated = false; // Reset the updated flag for the next frame
          particle.heatExchanged = false; // Reset heat exchanged flag for the next frame
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
        !(grid[ny][nx] instanceof AirParticle) // Only erase if not already AirParticle
      ) {
        grid[ny][nx] = new AirParticle(nx, ny); // Replace with AirParticle
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

// Factory function to create particles
function createParticle(type, x, y) {
  switch (type) {
    case ParticleType.SAND:
      return new SandParticle(x, y, color(random(200, 255), random(150, 200), random(0, 50)));
    case ParticleType.WATER:
      return new WaterParticle(x, y, color(50, 100, random(180, 255)));
    case ParticleType.MAGMA:
      return new MagmaParticle(x, y);
    case ParticleType.ICE:
      return new IceParticle(x, y);
    case ParticleType.ROCK:
      return new RockParticle(x, y);
    case ParticleType.GLASS:
      return new GlassParticle(x, y);
    case ParticleType.MELTED_GLASS:
      return new MeltedGlassParticle(x, y);
    case ParticleType.BEDROCK:
      return new BedrockParticle(x, y);
    case ParticleType.FIRE:
      return new FireParticle(x, y);
    case ParticleType.WATER_GENERATOR:
      return new ParticleGenerator(x, y, WaterParticle);
    case ParticleType.DARK_HOLE:
      return new DarkHoleParticle(x, y);
    default:
      return null;
  }
}

// Function to add particles at a specific position
function addParticle(x, y, type) {
  let brushSize = parseInt(brushSizeInput.value) || 1; // Get brush size from input
  for (let i = -brushSize; i <= brushSize; i++) {
    for (let j = -brushSize; j <= brushSize; j++) {
      let nx = x + i;
      let ny = y + j;
      if (
        nx >= 0 && nx < gridWidth &&
        ny >= 0 && ny < gridHeight &&
        grid[ny][nx] instanceof AirParticle // Only add if the cell is empty
      ) {
        let particle = createParticle(type, nx, ny);
        console.log(`Adding particle of type ${particle} at (${nx}, ${ny})`);
        if (particle) {
          grid[ny][nx] = particle;
        }
      }
    }
  }
}

// Function to handle particle interactions
function handleParticleInteraction(x, y) {
  if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) {
    let selectedType = selectElement.value;

    if (selectedType === ParticleType.COOLER) {
      coolDownParticles(x, y);
    } else if (selectedType === ParticleType.ERASER) {
      eraseParticle(x, y);
    } else if (selectedType === ParticleType.HEATER) {
      heatUpParticles(x, y);
    } else {
      addParticle(x, y, selectedType);
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

      if (particle === null || particle instanceof AirParticle) {
        continue;
      }

      particle.show();
    }
  }
}