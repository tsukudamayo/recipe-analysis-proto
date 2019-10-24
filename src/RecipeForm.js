
import React, { useState } from 'react';
import Loader from 'react-loader-spinner';
import axios from 'axios';

import { RadarChartWrapper } from './RadarChartWrapper';
import { BarChartWrapper } from './BarChartWrapper';
import { sampleRecipeName } from './sampleRecipeName.js';

import './RecipeForm.css'

export const RecipeForm = ({
  ingredientsList,
  originalRecipe,
  annotatedRecipe,
  recipeTimeData,
  recipeLevelData,
  nerText,
  wakatiText,
  expectedTime,
  loading,
  onSubmit
}) => {
  const [recipe, setRecipe] = useState({
    ingredientsList,
    originalRecipe,
    annotatedRecipe,
    recipeTimeData,
    recipeLevelData,
    nerText,
    wakatiText,
    expectedTime,
    loading
  });

  const handleChange = ({ target }) => {
        setRecipe((recipe) => ({
          ...recipe,
          [target.name]: target.value
        }));
    console.log('recipe.originalRecipe: ', recipe.originalRecipe);
  }

  const postRecipe = () => {
    console.log('body : ', JSON.stringify({'data': recipe.originalRecipe}));
    let data = recipe.originalRecipe;
    setRecipe((recipe) => ({
      ...recipe,
      loading: true
    }));
    console.log('recipe.loading : ', recipe.loading);
    axios.post('http://192.168.99.100:5000/ner', {
      method: 'POST',
      data: data,
      headers: {
        'Content-Types': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    })
      .then((response) => {
        console.log('response : ', response);
        console.log('recipe : ', recipe);
        const text = response.data['data'];
        const wakati = response.data['wakati'];
        console.log('recipe : ', recipe);
        setRecipe((recipe) => ({
          ...recipe,
          nerText: text,
          wakatiText: wakati,
          annotatedRecipe: colorAnnotate(text),
          loading: false
        }));
        console.log('recipe.loading : ', recipe.loading);
      });

    return ;
  };

  const colorAnnotate = (text) => {
    let textToWakatiList = text.split(' ');
    console.log('textToWakatiList : ', textToWakatiList);
    let colorStringsList = textToWakatiList.map((strings) => {
      if (strings.indexOf('/Ac') !== -1) {
        return '<font color="orange">' + strings + '</font>';
      }
      else if (strings.indexOf('/F') !== -1) {
        return '<font color="red">' + strings + '</font>';
      }
      else {
        return strings;
      }
    });
    console.log('colorText : ', colorStringsList);
    let joinColoredText = colorStringsList.join(' ');
    console.log('joinColoredText : ', joinColoredText);

    return joinColoredText;
  };

  const fetchTimeData = () => {
    let data = recipe.nerText
    axios.post('http://192.168.99.100:5000/time', {
      method: 'POST',
      data: data,
      headers: {
        'Content-Types': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
      .then((response) => {
        console.log('response : ', response);
        console.log('recipe : ', recipe);
        const dataMart = radarChartDataMart(response.data['data']);
        const time = response.data['time'];
        setRecipe((recipe) => ({
          ...recipe,
          recipeTimeData: dataMart,
          expectedTime: time
        }));
      });

    console.log('recipe.nerText : ', recipe.nerText);
    console.log('recipeTimeData : ', recipeTimeData);
  };

  const radarChartDataMart = (data) => {
    console.log('data:', data);
    const dataMart = Object.keys(data[0]).map((key) => {
      return { action: key, time: data[0][key] };
    });
    console.log('dataMart : ', dataMart);
    return dataMart;
  };

  const fetchRecipeLevel = () => {
    let data = recipe.ingredientsList;
    let wakati = recipe.wakatiText;
    axios.post('http://192.168.99.100:5000/level', {
      method: 'POST',
      data: [data, wakati],
      headers: {
        'Content-Types': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
      .then((response) => {
        console.log('response : ', response);
        console.log('recipe : ', recipe);
        console.log('data: ', response.data['data']);
        setRecipe((recipe) => ({
          ...recipe,
          recipeLevelData: response.data['data']
        }));
      });
  };

  const verifyValue = () => {
    console.log(recipe.recipeTimeData);
  }

  return (
    <div>
      <button onClick={postRecipe}>レシピ</button>
      <button onClick={fetchTimeData}>時間</button>
      <button onClick={fetchRecipeLevel}>レベル</button>
      <button onClick={verifyValue}>保存</button>
      <form id="recipe" onSubmit={() => onSubmit(recipe)}>
        <div className="formTable">
          <div className="recipeLabels">
            <p><label htmlFor="ingredientsList">材料</label></p>
            <textarea
              name="ingredientsList"
              type="text"
              value={recipe.ingredientsList}
              id="ingredientsList"
              onChange={handleChange}
              className="recipeForms"
              rows="20"
              cols="50"
            />
          </div>
          <div className="recipeLabels">
            <p><label htmlFor="originalRecipe">作り方</label></p>
            <textarea
              name="originalRecipe"
              type="text"
              value={recipe.originalRecipe}
              id="originalRecipe"
              onChange={handleChange}
              className="recipeForms"
              rows="20"
              cols="50"
            />
          </div>
        </div>

      </form>
      <div className="resultRendering">
        <div className="chartCell">
          <div className="expectedTime">
            調理推定時間<span className="numberOfTime">{recipe.expectedTime}</span>分
          </div>
          <BarChartWrapper
            data={recipe.recipeTimeData}
          />
          <RadarChartWrapper
            data={recipe.recipeLevelData}
            recipename={sampleRecipeName}
          />
        </div>

    
        <div className="recipeForms">
          {recipe.loading
           ? <Loader type="Watch"/>
           : <div id="annotatedRecipe" dangerouslySetInnerHTML={{__html: recipe.annotatedRecipe}}/>
          }
        </div>
      </div>
      
    </div>
  );
};
