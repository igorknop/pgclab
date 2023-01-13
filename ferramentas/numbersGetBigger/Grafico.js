export default class Grafico {
    constructor() {
        this.labels = [];
        this.data = {
            labels: this.labels,
            datasets: [{
                label: 'Taxa por segundo',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [],
            }]
        };

        this.config = {
            type: 'line',
            data: this.data,
            options: {
                scales: {
                    xAxis: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        suggestedMin: 0,
                        suggestedMax: 10,
                        type: 'logarithmic',
                    }
                },
                elements: {
                    point: {
                        pointStyle: 'line'
                    }
                },
                plugins: {
                    tooltip: {
                        enabled: true
                    }
                }
            }
        };

        this.chart = new Chart(
            document.getElementById('graph'),
            this.config
        );
        this.chart.canvas.parentNode.style.height = '900px';
        this.chart.canvas.parentNode.style.width = '800px';
    }

    adicionarDado(label, data) {
        // this.chart.data.labels.push(label);
        this.chart.data.labels.push('');
        this.chart.data.datasets.forEach((dataset) => {
            dataset.data.push(data);
        });
        // this.chart.update();
    }

    atualizarGrafico() {
        this.chart.update('none');
    }


}