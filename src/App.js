import React from 'react';

import './App.css';
import { RecipeForm } from './RecipeForm';

function App() {
  return (
    <div className="App">
      <div>こんにちは</div>
      <RecipeForm
        originalRecipe="abcde"
      />
    </div>
  );
}

export default App;
