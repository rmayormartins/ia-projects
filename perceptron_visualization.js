import React, { useState, useEffect, useRef } from 'react';

const PerceptronVisualization = () => {
  const [w1, setW1] = useState(1);
  const [w2, setW2] = useState(1);
  const [bias, setBias] = useState(0);
  const [points, setPoints] = useState([]);
  const canvasRef = useRef(null);
  
  // Gerar pontos de exemplo
  useEffect(() => {
    const newPoints = [];
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 2 - 1;
      const y = Math.random() * 2 - 1;
      // Classificação baseada em uma linha para exemplo
      const baseClass = y > 0.5 * x ? 1 : -1;
      newPoints.push({ x, y, class: baseClass });
    }
    setPoints(newPoints);
  }, []);
  
  // Desenhar no canvas
  useEffect(() => {
    if (!canvasRef.current || points.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Limpar canvas
    ctx.clearRect(0, 0, width, height);
    
    // Desenhar eixos
    ctx.strokeStyle = '#ccc';
    ctx.beginPath();
    ctx.moveTo(width/2, 0);
    ctx.lineTo(width/2, height);
    ctx.moveTo(0, height/2);
    ctx.lineTo(width, height/2);
    ctx.stroke();
    
    // Função para converter coordenadas
    const mapX = x => (x * width/4) + width/2;
    const mapY = y => height/2 - (y * height/4);
    
    // Desenhar linha de decisão (hiperplano)
    // w1*x + w2*y + b = 0, resolvendo para y
    // y = (-w1*x - b) / w2
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    // Para evitar divisão por zero
    if (w2 !== 0) {
      const x1 = -2;
      const y1 = (-w1*x1 - bias) / w2;
      const x2 = 2;
      const y2 = (-w1*x2 - bias) / w2;
      
      ctx.moveTo(mapX(x1), mapY(y1));
      ctx.lineTo(mapX(x2), mapY(y2));
    } else {
      // Linha vertical se w2 = 0
      const x = -bias / w1;
      ctx.moveTo(mapX(x), 0);
      ctx.lineTo(mapX(x), height);
    }
    ctx.stroke();
    
    // Desenhar pontos
    points.forEach(point => {
      ctx.fillStyle = point.class === 1 ? 'blue' : 'red';
      ctx.beginPath();
      ctx.arc(mapX(point.x), mapY(point.y), 6, 0, 2 * Math.PI);
      ctx.fill();
    });
    
    // Calcular acurácia do modelo atual
    const correctPredictions = points.filter(point => {
      // Predição: sinal de w1*x + w2*y + bias
      const predictedClass = (w1 * point.x + w2 * point.y + bias) > 0 ? 1 : -1;
      return predictedClass === point.class;
    }).length;
    
    const accuracy = (correctPredictions / points.length) * 100;
    
    // Mostrar acurácia
    ctx.fillStyle = 'black';
    ctx.font = '14px Arial';
    ctx.fillText(`Acurácia: ${accuracy.toFixed(1)}%`, 10, 20);
    
  }, [points, w1, w2, bias]);
  
  return (
    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Perceptron: Visualização do Hiperplano</h2>
      
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={400} 
        className="border border-gray-300 bg-white mb-4"
      />
      
      <div className="w-full max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Peso w₁: {w1.toFixed(2)}
          </label>
          <input
            type="range"
            min="-3"
            max="3"
            step="0.1"
            value={w1}
            onChange={(e) => setW1(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Peso w₂: {w2.toFixed(2)}
          </label>
          <input
            type="range"
            min="-3"
            max="3"
            step="0.1"
            value={w2}
            onChange={(e) => setW2(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bias b: {bias.toFixed(2)}
          </label>
          <input
            type="range"
            min="-3"
            max="3"
            step="0.1"
            value={bias}
            onChange={(e) => setBias(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Azul:</strong> Classe positiva | <strong>Vermelho:</strong> Classe negativa</p>
        <p className="mt-2"><strong>Equação do hiperplano:</strong> {w1.toFixed(2)}x + {w2.toFixed(2)}y + {bias.toFixed(2)} = 0</p>
        <p className="mt-2">Ajuste os controles para ver como os pesos e o bias afetam a fronteira de decisão!</p>
      </div>
    </div>
  );
};

export default PerceptronVisualization;
