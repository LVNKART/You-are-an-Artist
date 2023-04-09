let cuboids = [];
let frozen;
let palettes = [
  ["#FF0000", "#E60000", "#CC0000", "#B30000", "#990000", "#800000", "#0000FF", "#0000E6", "#0000CC", "#0000B3", "#000099", "#000080", "#800080", "#990099", "#B300B3", "#CC00CC", "#E600E6", "#FF00FF", "#660066", "#FFFF00", "#FFCC00", "#FF9900", "#FF6600", "#FF3300"],
  ["#5F0F40", "#9A031E", "#FB8B24", "#E36414", "#0F4C5C", "#323031", "#D3D3D3", "#D3D3D3", "#D3D3D3", "#D3D3D3", "#D3D3D3", "#D3D3D3", "#D3D3D3", "#D3D3D3", "#D3D3D3", "#D3D3D3", "#D3D3D3", "#D3D3D3", "#D3D3D3", "#D3D3D3", "#D3D3D3", "#D3D3D3", "#D3D3D3", "#D3D3D3"],
  ["#FFD229", "#39A838", "#DE0A23", "#E0CD00", "#007EC5", "#0B5738", "#D87000", "#009EE2", "#5A496D", "#E21782", "#F6B317", "#42297A", "#E73088", "#00B1E8", "#005778", "#E30079", "#E9560D", "#C11581", "#C7E5F9", "#DF007E", "#EFC7DA", "#C7E5F9", "#EB6109", "#0092C5"],
  ["#FFC0CB", "#FFB6C1", "#FF69B4", "#FF1493", "#DB7093", "#E9967A", "#FFDAB9", "#EE82EE", "#DA70D6", "#BA55D3", "#AD6DAD", "#FFA07A", "#F88379", "#FF7F50", "#F08080", "#DC143C", "#FF4500", "#FF6347", "#FF8C69", "#FFA07A", "#FFDEAD", "#FFE4B5", "#FFEBCD", "#FFF8DC"],
  ["#0B3D91", "#1C4A9F", "#2E58AE", "#3F65BD", "#5067CA", "#164672", "#084C84", "#005295", "#0F3D5B", "#1D476C", "#2E517E", "#3F5B8F", "#B33D00", "#C45000", "#D56300", "#E67600", "#F58900", "#A43A00", "#8A3200", "#712A00", "#572200", "#3D1A00", "#230F00", "#090700"],
  ["#FFD700", "#E6C200", "#CCAD00", "#B39800", "#998200", "#806D00", "#008000", "#007300", "#006600", "#005900", "#004C00", "#004000", "#40A040", "#59B359", "#73C673", "#8CD98C", "#A6ECA6", "#C0FFC0", "#408040", "#A0A000", "#9E9E00", "#9C9C00", "#9A9A00", "#989898"],
  ["#F0F0F0", "#E8E8E8", "#E0E0E0", "#D8D8D8", "#D0D0D0", "#C8C8C8", "#C0C0C0", "#B8B8B8", "#B0B0B0", "#A8A8A8", "#A0A0A0", "#989898", "#909090", "#888888", "#808080", "#787878", "#707070", "#686868", "#606060", "#585858", "#505050", "#484848", "#404040", "#383838"],
	["#E0F8FF", "#CCEBFF", "#B9DEFF", "#A5D1FF", "#92C4FF", "#7FB7FF", "#6BAAFF", "#589DFF", "#4490FF", "#3183FF", "#1E76FF", "#0B69FF","#005CFF", "#0050E6", "#0044CC", "#0038B3", "#002C99", "#002080", "#001466", "#00084C", "#000032", "#000018", "#000000", "#000000"],
	["#C19A6B", "#A67C52", "#8B5A3C", "#704227", "#553212", "#40210E", "#8A3324", "#A0410D", "#B76E79", "#E08D3C", "#E3A857", "#C4A35A","#C9AE5D", "#A5B076", "#729B79", "#5F9EA0", "#264348", "#4A777A", "#6D9A9D", "#8DA399", "#ACAD75", "#CBB994", "#E6BE8A", "#F7E9E3"],
	["#FCE4EC", "#F8BBD0", "#F48FB1", "#F06292", "#EC407A", "#E91E63", "#D81B60", "#C2185B", "#AD1457", "#880E4F", "#C5CAE9", "#9FA8DA", "#7986CB", "#5C6BC0", "#3F51B5", "#3949AB", "#303F9F", "#283593", "#1A237E", "#0D47A1", "#E1F5FE", "#B3E5FC"],
]

let currentPaletteIndex = 0;
let movementModes = ["random", "synchronized", "waves"];
let currentMovementModeIndex = 0;

function setup() {
  createCanvas(2000, 2000, WEBGL);
  angleMode(DEGREES);
	frozen = false;


  const gridSize = 17;
  const spacing = 40;
  let index = 0;

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (index >= 289) {
        break;
      }

      let x = map(i, 0, gridSize - 1, -spacing * (gridSize - 1) / 2, spacing * (gridSize - 1) / 2);
      let z = map(j, 0, gridSize - 1, -spacing * (gridSize - 1) / 2, spacing * (gridSize - 1) / 2);
      let h = 15;
      let w = 22;
      let d = w;
      let cuboidColor = color(0, 0, 0);
      let targetColor = color(0, 0, 0);

      cuboids.push({
        x: x,
        y: -h / 2,
        z: z,
        h: h,
        w: w,
        d: d,
        color: cuboidColor,
        targetColor: targetColor,
        heightPhaseOffset: random(0, TWO_PI*100),
        colorPhaseOffset: random(TWO_PI),
        isOriginal: true 
      });

      index++;
    }
  }


  for (let i = 0; i < cuboids.length; i++) {
    let cuboid = cuboids[i];
    cuboid.color = color(random(palettes[0]));
    cuboid.targetColor = color(random(palettes[0]));
  }
}

function draw() {
  background(0);

  camera(0, -800, 0, 0, 0, 0, 0, 0, -1);

  ambientLight(15);

  pointLight(255, 255, 255, 0, -300, 200);

  for (let i = 0; i < cuboids.length; i++) {
    let cuboid = cuboids[i];
    push();
    translate(cuboid.x, cuboid.y, cuboid.z);

    if (!frozen) {

      updateCuboidHeight(cuboid);
      const colorProgress = (sin(millis() / 10 + cuboid.colorPhaseOffset) + 1) / 2;
      const currentColor = lerpColor(cuboid.color, cuboid.targetColor, colorProgress);
      fill(currentColor);
    } else {
      fill(cuboid.color);
    }

    strokeWeight(0.5);
    stroke(0);
    box(cuboid.w, cuboid.h, cuboid.d);
    pop();
  }
}

let deletedCuboids = [];

function keyPressed() {
  if (key === 'c') {
    switchPalette();
  } else if (key === 'm') {
    switchMovementMode();
  } else if (key === 'd') {
    deleteRandomCuboid();
  } else if (key === 'a') {
    addDeletedCuboid();
  } else if (key === 'g') {
    frozen = !frozen;
  } else if (key === 'b') {
    replaceRandomCuboid();
  } else if (key === 's' || key === 'S') {
    saveCanvas('cuboids-art', 'png');
	} else if (key === 'f' || key === 'F') {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}
 
function deleteRandomCuboid() {
  if (cuboids.length > 0) {
    const randomIndex = floor(random(cuboids.length));
    const removedCuboid = cuboids.splice(randomIndex, 1);
    deletedCuboids.push(removedCuboid[0]);
  }
}

function addDeletedCuboid() {
  if (deletedCuboids.length > 0) {
    const lastDeletedCuboid = deletedCuboids.pop();
    cuboids.push(lastDeletedCuboid);
  }
}

function switchPalette() {
  currentPaletteIndex = (currentPaletteIndex + 1) % palettes.length;
  let newPalette = palettes[currentPaletteIndex];

  for (let i = 0; i < cuboids.length; i++) {
    let cuboid = cuboids[i];
    cuboid.color = color(random(newPalette));
    cuboid.targetColor = color(random(newPalette));
  }
}

function switchMovementMode() {
  const previousMovementMode = movementModes[currentMovementModeIndex];
  currentMovementModeIndex = (currentMovementModeIndex + 1) % movementModes.length;
  const nextMovementMode = movementModes[currentMovementModeIndex];

  for (let i = 0; i < cuboids.length; i++) {
    let cuboid = cuboids[i];

    if (previousMovementMode === "random" && nextMovementMode !== "random") {
      cuboid.originalHeightPhaseOffset = cuboid.heightPhaseOffset;
    }

    if (nextMovementMode === "random") {
      if (cuboid.hasOwnProperty("originalHeightPhaseOffset")) {
        cuboid.heightPhaseOffset = cuboid.originalHeightPhaseOffset;
      } else {
        cuboid.heightPhaseOffset = random(0, TWO_PI * 10);
      }
    } else if (nextMovementMode === "synchronized") {
      cuboid.heightPhaseOffset = 0;
    } else if (nextMovementMode === "waves") {
      cuboid.heightPhaseOffset = cuboid.x / 5 + cuboid.z / 5;
    }
  }
}

function replaceRandomCuboid() {
  const originalCuboids = cuboids.filter(cuboid => cuboid.isOriginal);

  if (originalCuboids.length === 0) return;

  const index = floor(random(originalCuboids.length));
  const originalCuboid = originalCuboids[index];

  const newWidth = originalCuboid.w / 2;
  const newDepth = originalCuboid.d / 2;
  const spacing = 5; // Adjust the spacing between the smaller cuboids

  const offsets = [
    { x: -newWidth / 2 - spacing / 2, z: -newDepth / 2 - spacing / 2 },
    { x: -newWidth / 2 - spacing / 2, z: newDepth / 2 + spacing / 2 },
    { x: newWidth / 2 + spacing / 2, z: -newDepth / 2 - spacing / 2 },
    { x: newWidth / 2 + spacing / 2, z: newDepth / 2 + spacing / 2 },
  ];

  for (let i = 0; i < offsets.length; i++) {
    const newCuboid = { ...originalCuboid, isOriginal: false };
    newCuboid.x += offsets[i].x;
    newCuboid.z += offsets[i].z;
    newCuboid.w = newWidth;
    newCuboid.d = newDepth;
    cuboids.push(newCuboid);
  }

  // Remove the original cuboid
  cuboids.splice(cuboids.indexOf(originalCuboid), 1);
}

function updateCuboidHeight(cuboid) {
  let minHeight = 15;
  let maxHeight = 70;
  let phaseOffset;

  if (movementModes[currentMovementModeIndex] === "random") {
    phaseOffset = cuboid.heightPhaseOffset;
  } else if (movementModes[currentMovementModeIndex] === "synchronized") {
    phaseOffset = 0;
  } else if (movementModes[currentMovementModeIndex] === "waves") {
    phaseOffset = cuboid.x / 5 + cuboid.z / 5;
  }

  // Use phaseOffset in the sin function
  cuboid.h = map(sin(millis() / 50 + phaseOffset), -1, 1, minHeight, maxHeight);
  cuboid.y = -cuboid.h / 2;
}