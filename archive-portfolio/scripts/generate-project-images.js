const fs = require('fs');
const { createCanvas } = require('canvas');

const projects = [
  {
    name: 'project-image-1',
    title: 'Early Cancer Detection',
    color: '#FF6B6B'
  },
  {
    name: 'project-image-2',
    title: 'Crypto in VR',
    color: '#4ECDC4'
  },
  {
    name: 'project-image-3',
    title: 'Hate Map',
    color: '#45B7D1'
  },
  {
    name: 'project-image-4',
    title: 'Website Section Hider',
    color: '#96CEB4'
  }
];

projects.forEach(project => {
  const canvas = createCanvas(800, 400);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = project.color;
  ctx.fillRect(0, 0, 800, 400);

  // Text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(project.title, 400, 200);

  // Save the image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`public/assets/project-image/${project.name}.png`, buffer);
}); 