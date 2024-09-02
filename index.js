document.addEventListener("DOMContentLoaded", function() {
    // --- Cosine Wave Section ---
    const cosineWaveSection = document.getElementById('cosineWave');
    
    if (cosineWaveSection) {
        const cosineWaveDiv = cosineWaveSection.querySelector('#cosineWavePlot');
        const ampSliderDiv = cosineWaveSection.querySelector('#ampSlider');
        const freqSliderDiv = cosineWaveSection.querySelector('#freqSlider');
        const phaseSliderDiv = cosineWaveSection.querySelector('#phaseSlider');
        const ampValueSpan = cosineWaveSection.querySelector('#ampValue');
        const freqValueSpan = cosineWaveSection.querySelector('#freqValue');
        const phaseValueSpan = cosineWaveSection.querySelector('#phaseValue');

        let amplitude = 1.0;
        let frequency = 1.0;
        let phase = 0.0;

        function generateData(amplitude, frequency, phase) {
            let x = [];
            let y = [];
            for (let i = 0; i <= 1000; i++) {
                let t = i / 1000.0 * 2 * Math.PI;  // Higher resolution
                x.push(t);
                y.push(amplitude * Math.cos(frequency * t + phase)); // Using cosine function
            }
            return { x: x, y: y };
        }

        let data = generateData(amplitude, frequency, phase);
        Plotly.newPlot(cosineWaveDiv, [{
            x: data.x,
            y: data.y,
            mode: 'lines',
            name: 'cosine wave'
        }], {
            title: 'Cosine Wave',
            xaxis: { title: 'x', range: [0, 2 * Math.PI] },
            yaxis: { title: 'y = A cos(fx + φ)', range: [-2, 2] },
            grid: { rows: 1, columns: 1, pattern: 'independent' }
        });

        function updatePlot() {
            let data = generateData(amplitude, frequency, phase);
            Plotly.restyle(cosineWaveDiv, {
                x: [data.x],
                y: [data.y]
            });
        }

        function setupSlider(sliderDiv, valueSpan, initialValue, min, max, step, onUpdate) {
            noUiSlider.create(sliderDiv, {
                start: [initialValue],
                range: {
                    'min': [min],
                    'max': [max]
                },
                step: step
            });

            sliderDiv.noUiSlider.on('update', function (values, handle) {
                let value = parseFloat(values[handle]);
                valueSpan.innerHTML = value.toFixed(2);
                onUpdate(value);
                updatePlot();
            });
        }

        setupSlider(ampSliderDiv, ampValueSpan, amplitude, 0.1, 2.0, 0.01, function (value) {
            amplitude = value;
        });

        setupSlider(freqSliderDiv, freqValueSpan, frequency, 0.1, 10.0, 0.1, function (value) {
            frequency = value;
        });

        setupSlider(phaseSliderDiv, phaseValueSpan, phase, 0.0, 2 * Math.PI, 0.01, function (value) {
            phase = value;
        });
    }

    // --- Unit Circle Section ---
    const unitCircleSection = document.getElementById('unit-circle');

    if (unitCircleSection) {
        const canvas = unitCircleSection.querySelector('#unitCircleCanvas');
        const ctx = canvas.getContext('2d');

        canvas.addEventListener('mousemove', update);

        function update(event) {
            let rect = canvas.getBoundingClientRect();
            let x = event.clientX - rect.left;
            let y = event.clientY - rect.top;
            let angle = Math.atan2(y - canvas.height / 2, x - canvas.width / 2);
            updatePlot(angle);
        }

        function updatePlot(angle) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, 150, 0, Math.PI * 2);
            ctx.strokeStyle = 'blue';
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, canvas.height / 2);
            ctx.lineTo(canvas.width, canvas.height / 2);
            ctx.moveTo(canvas.width / 2, 0);
            ctx.lineTo(canvas.width / 2, canvas.height);
            ctx.strokeStyle = 'black';
            ctx.stroke();

            let cosVal = Math.cos(angle);
            let sinVal = Math.sin(angle);

            ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, canvas.height / 2);
            ctx.lineTo(canvas.width / 2 + 150 * cosVal, canvas.height / 2);
            ctx.lineTo(canvas.width / 2 + 150 * cosVal, canvas.height / 2 + 150 * sinVal);
            ctx.fill();

            ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, canvas.height / 2);
            ctx.lineTo(canvas.width / 2, canvas.height / 2 + 150 * sinVal);
            ctx.lineTo(canvas.width / 2 + 150 * cosVal, canvas.height / 2 + 150 * sinVal);
            ctx.fill();

            let tanVal = Math.tan(angle);
            ctx.strokeStyle = 'orange';
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2 - 150, canvas.height / 2 + 150 * tanVal);
            ctx.lineTo(canvas.width / 2 + 150, canvas.height / 2 - 150 * tanVal);
            ctx.stroke();
            ctx.setLineDash([]);

            let angleDeg = angle * 180 / Math.PI;
            ctx.fillStyle = 'purple';
            ctx.font = '14px Arial';
            ctx.fillText(`Angle: ${angleDeg.toFixed(2)}°`, 10, 20);

            ctx.fillStyle = 'red';
            ctx.fillText(`cos: ${cosVal.toFixed(2)}`, canvas.width - 100, 20);

            ctx.fillStyle = 'green';
            ctx.fillText(`sin: ${sinVal.toFixed(2)}`, canvas.width - 100, 40);

            ctx.fillStyle = 'orange';
            ctx.fillText(`tan: ${tanVal.toFixed(2)}`, canvas.width - 100, 60);
        }

        updatePlot(Math.PI / 6);
    }
});
