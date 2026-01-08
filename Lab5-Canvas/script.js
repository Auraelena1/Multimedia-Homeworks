const canvas = document.getElementById('chartCanvas');
const ctx = canvas.getContext('2d');

const config = {
    pointSpacing: 20,
    maxValues: Math.ceil(canvas.width / 20) + 1,
    gridSpacingX: 100,
    gridSpacingY: 50,
    speed: 1000,
    isRunning: true,
    showGrid: true,
    chartType: 'line',
    colors: ['#00ff00', '#00ccff', '#ff3300']
};

let dataSeries = [[], [], []];

function initData() {
    dataSeries = [[], [], []];
    for(let i=0; i<config.maxValues; i++) {
        dataSeries[0].push(0);
        dataSeries[1].push(0);
        dataSeries[2].push(0);
    }
}
initData();

function generateData() {
    const margin = 50;
    const maxH = canvas.height - margin;

    dataSeries[0].push(Math.floor(Math.random() * (maxH - 100)) + 50);
    dataSeries[1].push(Math.floor(Math.random() * (maxH - 200)) + 100);
    dataSeries[2].push(Math.floor(Math.random() * (maxH - 50)) + 20);

    dataSeries.forEach(series => {
        if (series.length > config.maxValues) {
            series.shift();
        }
    });

    updateStats();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const isDark = document.body.classList.contains('dark-mode');
    ctx.fillStyle = isDark ? '#222' : '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (config.showGrid) {
        drawGrid(isDark ? '#444' : '#e0e0e0');
    }

    dataSeries.forEach((series, index) => {
        drawSeries(series, config.colors[index], config.chartType);
    });
}

function drawGrid(color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();

    for (let x = 0; x <= canvas.width; x += config.gridSpacingX) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.fillStyle = '#888';
        ctx.fillText(x, x + 5, canvas.height - 5);
    }

    for (let y = 0; y <= canvas.height; y += config.gridSpacingY) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.fillText(canvas.height - y, 5, y - 5);
    }
    ctx.stroke();
}

function drawSeries(data, color, type) {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 3;

    if (type === 'line' || type === 'area') {
        ctx.beginPath();
        for (let i = 0; i < data.length; i++) {
            const x = i * config.pointSpacing;
            const y = canvas.height - data[i];

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        
        if (type === 'area') {
            ctx.lineTo((data.length - 1) * config.pointSpacing, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.globalAlpha = 0.2;
            ctx.fill();
            ctx.globalAlpha = 1.0;
        } else {
            ctx.stroke();
        }
    } 
    else if (type === 'bar') {
        const barWidth = config.pointSpacing - 5;
        for (let i = 0; i < data.length; i++) {
            const x = i * config.pointSpacing;
            const h = data[i];
            const y = canvas.height - h;
            ctx.fillRect(x, y, barWidth, h);
        }
    }
    else if (type === 'scatter') {
        for (let i = 0; i < data.length; i++) {
            const x = i * config.pointSpacing;
            const y = canvas.height - data[i];
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function updateStats() {
    const ids = [['valA', 'avgA', 'maxA'], ['valB', 'avgB', 'maxB'], ['valC', 'avgC', 'maxC']];

    dataSeries.forEach((series, idx) => {
        const current = series[series.length - 1];
        const max = Math.max(...series);
        const avg = Math.floor(series.reduce((a, b) => a + b, 0) / series.length);

        document.getElementById(ids[idx][0]).innerText = current;
        document.getElementById(ids[idx][1]).innerText = avg;
        document.getElementById(ids[idx][2]).innerText = max;
    });
}

let timer;
function startAnimation() {
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
        if (config.isRunning) {
            generateData();
            draw();
        }
    }, config.speed);
}

document.getElementById('toggleBtn').addEventListener('click', function() {
    config.isRunning = !config.isRunning;
    this.innerText = config.isRunning ? 'Pause' : 'Resume';
    this.className = config.isRunning ? 'btn primary' : 'btn warning';
});

document.getElementById('resetBtn').addEventListener('click', () => {
    initData();
    draw();
});

document.getElementById('speedRange').addEventListener('input', function() {
    config.speed = this.value;
    document.getElementById('speedValue').innerText = this.value + 'ms';
    startAnimation();
});

document.getElementById('chartType').addEventListener('change', function() {
    config.chartType = this.value;
    draw();
});

document.getElementById('gridToggle').addEventListener('change', function() {
    config.showGrid = this.checked;
    draw();
});

document.getElementById('themeBtn').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    draw();
});

document.getElementById('exportBtn').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'chart-export.png';
    link.href = canvas.toDataURL();
    link.click();
});

draw();
startAnimation();