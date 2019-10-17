import React from 'react';

import './App.css';
import { RecipeForm } from './RecipeForm';
import { RadarChartWrapper } from './RadarChartWrapper';
import { BarChartWrapper } from './BarChartWrapper';
import { sampleData } from './sampleData';
import { sampleRecipeName } from './sampleRecipeName.js';
import { sampleTimeData } from './sampleTimeData';

function App() {
  return (
    <div className="App">
      <div>こんにちは</div>
      <RecipeForm
        originalRecipe="abcde"
      />
      <RadarChartWrapper
        data={sampleData}
        recipename={sampleRecipeName}
      />
      <BarChartWrapper
        data={sampleTimeData}
      />
    </div>
  );
}

export default App;
