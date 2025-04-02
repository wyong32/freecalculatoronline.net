document.addEventListener('DOMContentLoaded', () => {
    initCalculator();
});

function initCalculator() {
    const shapeButtons = document.querySelectorAll('[data-shape]');
    const unitButtons = document.querySelectorAll('[data-unit]');
    const calculateButton = document.querySelector('.calculate-btn');
    const inputFields = document.querySelectorAll('input[type="number"]');
    
    shapeButtons.forEach(button => {
        button.addEventListener('click', () => {
            shapeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            updateInputFields(button.dataset.shape);
        });
    });

    unitButtons.forEach(button => {
        button.addEventListener('click', () => {
            unitButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            updateUnitLabels();
            convertUnits();
        });
    });

    calculateButton.addEventListener('click', calculateResults);
    inputFields.forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('error');
        });
    });
}

function updateInputFields(shape) {
    const rectangleFields = document.getElementById('rectangle-fields');
    const circleFields = document.getElementById('circle-fields');
    const triangleFields = document.getElementById('triangle-fields');
    const trapezoidFields = document.getElementById('trapezoid-fields');

    [rectangleFields, circleFields, triangleFields, trapezoidFields].forEach(field => {
        if (field) field.style.display = 'none';
    });

    const selectedField = document.getElementById(`${shape}-fields`);
    if (selectedField) {
        selectedField.style.display = 'grid';
        // 重置所有输入字段
        selectedField.querySelectorAll('input[type="number"]').forEach(input => {
            // input.value = '';
            input.classList.remove('error');
        });

        // 为圆形形状设置默认值
        if (shape === 'circle') {
            document.getElementById('wasteFactor').value = '5';
            document.getElementById('density').value = '2.4';
            document.getElementById('materialCost').value = '600';
        }
    }
}

function updateUnitLabels() {
    const isMetric = document.querySelector('[data-unit].active').dataset.unit === 'metric';
    const unitLabels = document.querySelectorAll('.unit-label');

    unitLabels.forEach(label => {
        label.textContent = isMetric ? 'meters' : 'feet';
    });
}

function convertUnits() {
    const isMetric = document.querySelector('[data-unit].active').dataset.unit === 'metric';
    const inputs = document.querySelectorAll('.dimension-fields input[type="number"]');
    
    inputs.forEach(input => {
        if (input.value) {
            const value = parseFloat(input.value);
            if (isMetric) {
                input.value = (value * 0.3048).toFixed(2); // feet to meters
            } else {
                input.value = (value / 0.3048).toFixed(2); // meters to feet
            }
        }
    });
}

function calculateResults() {
    const activeShape = document.querySelector('[data-shape].active').dataset.shape;
    const isMetric = document.querySelector('[data-unit].active').dataset.unit === 'metric';
    let area = 0;

    // Validate inputs
    if (!validateInputs()) {
        alert('请填写所有必填字段，并确保输入有效数字。');
        return;
    }

    // Calculate area based on shape
    switch(activeShape) {
        case 'rectangle':
            const length = parseFloat(document.getElementById('length').value);
            const width = parseFloat(document.getElementById('width').value);
            area = length * width;
            break;
        case 'circle':
            const radius = parseFloat(document.getElementById('radius').value);
            area = Math.PI * radius * radius;
            break;
        case 'triangle':
            const base = parseFloat(document.getElementById('base').value);
            const height = parseFloat(document.getElementById('height').value);
            area = (base * height) / 2;
            break;
        case 'trapezoid':
            const top = parseFloat(document.getElementById('top').value);
            const bottom = parseFloat(document.getElementById('bottom').value);
            const trapHeight = parseFloat(document.getElementById('trapezoid-height').value);
            area = ((top + bottom) * trapHeight) / 2;
            break;
    }

    const thickness = parseFloat(document.getElementById('thickness').value);
    const wasteFactor = parseFloat(document.getElementById('wasteFactor').value) || 5;
    const density = parseFloat(document.getElementById('density').value) || 2.4; // 可调整的沥青密度

    // Convert to metric if necessary
    if (!isMetric) {
        area = area * 0.092903; // square feet to square meters
    }

    // Calculate volume and asphalt quantity
    const volume = area * thickness;
    const asphaltQuantity = volume * density;
    const totalAsphalt = asphaltQuantity * (1 + wasteFactor / 100);

    // Calculate costs
    const materialCostPerTon = parseFloat(document.getElementById('materialCost').value) || 600;

    const materialCost = totalAsphalt * materialCostPerTon;
    const totalCost = materialCost;

    // Update result section
    const results = {
        area: area.toFixed(2),
        totalAsphalt: totalAsphalt.toFixed(2),
        materialCost: materialCost.toFixed(2),
        totalCost: totalCost.toFixed(2),
        unit: isMetric ? 'meters' : 'feet',
        timestamp: new Date().toLocaleString()
    };

    updateResultDisplay(results);
    saveResults(results);
}

function updateResultDisplay(results) {
    // document.getElementById('result').style.display = 'block';
    document.getElementById('totalArea').textContent = `${results.area} square ${results.unit}`;
    document.getElementById('asphaltNeeded').textContent = `${results.totalAsphalt} tonnes`;
    document.getElementById('materialCost').textContent = `￥${results.materialCost}`;
    document.getElementById('totalCost').textContent = `$${results.totalCost}`;

    // document.getElementById('totalArea').textContent = `${results.area} m²`;  // 使用平方米符号
    // document.getElementById('asphaltNeeded').textContent = `${results.totalAsphalt} t`;  // 使用吨的缩写
    // document.getElementById('materialCost').textContent = `CN¥${results.materialCost}`;  // 使用人民币标准符号
    // document.getElementById('totalCost').textContent = `USD$${results.totalCost}`;
}

function saveResults(results) {
    let savedResults = JSON.parse(localStorage.getItem('calculationHistory') || '[]');
    savedResults.push(results);
    localStorage.setItem('calculationHistory', JSON.stringify(savedResults));
}

function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const results = document.getElementById('result');
    
    doc.setFont('helvetica');
    doc.setFontSize(20);
    doc.text('沥青计算结果报告', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`生成时间: ${new Date().toLocaleString()}`, 20, 30);
    doc.text(`总面积: ${document.getElementById('totalArea').textContent}`, 20, 40);
    doc.text(`所需沥青: ${document.getElementById('asphaltNeeded').textContent}`, 20, 50);
    doc.text(`材料成本: ${document.getElementById('materialCost').textContent}`, 20, 60);
    doc.text(`总成本: ${document.getElementById('totalCost').textContent}`, 20, 70);
    
    doc.save('沥青计算报告.pdf');
}

function validateInputs() {
    const activeShape = document.querySelector('[data-shape].active').dataset.shape;
    const visibleInputs = document.querySelector(`#${activeShape}-fields`).querySelectorAll('input[type="number"]');
    const thicknessInput = document.getElementById('thickness');
    
    let isValid = true;
    
    visibleInputs.forEach(input => {
        const value = parseFloat(input.value);
        if (!value || value <= 0) {
            input.classList.add('error');
            isValid = false;
        }
    });

    const thickness = parseFloat(thicknessInput.value);
    if (!thickness || thickness <= 0) {
        thicknessInput.classList.add('error');
        isValid = false;
    }

    return isValid;
}