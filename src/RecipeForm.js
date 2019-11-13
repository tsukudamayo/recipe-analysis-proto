import React, { useState } from 'react';
import Loader from 'react-loader-spinner';
import axios from 'axios';

import { RadarChartWrapper } from './RadarChartWrapper';
import { BarChartWrapper } from './BarChartWrapper';
import { sampleRecipeName } from './sampleRecipeName.js';

import './RecipeForm.css'

const POST_URL = 'http://localhost:5000';
// const POST_URL = 'https://sampleweekcookdatapotal.azurewebsites.net';
// const POST_URL = 'http://23.100.108.226:5000';
// const POST_URL = 'http://192.168.99.100:5000';

export const RecipeForm = ({
  ingredientsList,
  originalRecipe,
  annotatedRecipe,
  recipeTimeData,
  recipeLevelData,
  nerText,
  wakatiText,
  expectedTime,
  actionTimeParams,
  selectedAction,
  selectedActionTime,
  actionCount,
  actionTimeInRecipe,
  actionTime,
  recipeTime,
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
    actionTimeParams,
    selectedAction,
    selectedActionTime,
    actionCount,
    actionTimeInRecipe,
    actionTime,
    recipeTime,
    loading
  });

  const handleChange = ({ target }) => {
    setRecipe((recipe) => ({
      ...recipe,
      [target.name]: target.value
    }));
    console.log('recipe.originalRecipe: ', recipe.originalRecipe);
    console.log('recipe.selectedAction : ', recipe.selectedAction);
  };

  const parameterChange = ({ target }) => {
    parameterHandler(target);
    setRecipe((recipe) => ({
      ...recipe,
      [target.name]: target.value,
    }));
  };

  const parameterHandler = (target) => {
    console.log('recipe.selectedAction : ', recipe.selectedAction);
    console.log('recipe.actionTimeParams : ', recipe.actionTimeParams);
    let filterByActionKey;
    let actionTimeParamsID;
    let actionTimeInRecipeID;
    let actionCountID;
    filterByActionKey = recipe.actionTimeParams.filter((item, index) => {
      if (item['action'] === recipe.selectedAction) {
        actionTimeParamsID = index;
        return true;
      }
      else {
        return false;
      }
    });
    console.log('filterByActionKey : ', filterByActionKey);
    console.log('targetIndex : ', actionTimeParamsID);
    console.log('recipe.actionTimeParams : ', recipe.actionTimeParams);
    const newActionTimeParams = recipe.actionTimeParams;
    console.log('newActionTimeParams : ', newActionTimeParams);
    console.log('target.value : ', target.value);
    newActionTimeParams[actionTimeParamsID]['time'] = Number(target.value);

    filterByActionKey = recipe.actionTimeInRecipe.filter((item, index) => {
      if (item['action'] === recipe.selectedAction) {
        actionTimeInRecipeID = index;
        return true;
      }
      else {
        return false;
      }
    });

    filterByActionKey = recipe.actionCount.filter((item, index) => {
      if (item['action'] === recipe.selectedAction) {
        actionCountID = index;
        return true;
      }
      else {
        return false;
      }
    });

    const newActionTimeInRecipe = recipe.actionTimeInRecipe;
    newActionTimeInRecipe[actionTimeInRecipeID]['time'] = Number(target.value) * recipe.actionCount[actionCountID]['count'];
    console.log('newActionTimeInRecipe[targetIndex] : ', newActionTimeInRecipe[actionTimeInRecipeID]);

    const summationActionTime = newActionTimeInRecipe.reduce((a, b) => a + b.time, 0);
    const evaluationRecipeTime = summationActionTime + recipe.recipeTime;

    setRecipe((recipe) => ({
      ...recipe,
      recipeTimeData: newActionTimeInRecipe,
      actionTimeParams: newActionTimeParams,
      actionTime: summationActionTime,
      expectedTime: evaluationRecipeTime
    }));

    return ;
  }

  const postRecipe = () => {
    console.log('body : ', JSON.stringify({'data': recipe.originalRecipe}));
    let data = recipe.originalRecipe;
    setRecipe((recipe) => ({
      ...recipe,
      loading: true
    }));
    console.log('recipe.loading : ', recipe.loading);
    axios.post(POST_URL + '/ner', {
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
        setRecipe((recipe) => ({
          ...recipe,
          nerText: text,
          wakatiText: wakati,
          annotatedRecipe: generateColorAnnotation(text),
          loading: false
        }));
        console.log('recipe.loading : ', recipe.loading);
      });

    return ;
  };

  const generateColorAnnotation = (text) => {
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
    let lf = /\r?\n/g;
    let br = '<br>';
    let lfToBR = joinColoredText.replace(lf, br);
    console.log('joinColoredText : ', joinColoredText);
    console.log('lfToBR : ', lfToBR);

    return lfToBR;
  };

  const fetchTimeData = () => {
    let actionCount;
    let time;
    let ner = recipe.nerText;
    let wakati = recipe.wakatiText;

    axios.post(POST_URL + '/time', {
      method: 'POST',
      data: [ner, wakati],
      headers: {
        'Content-Types': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
      .then((response) => {
        console.log('response : ', response);
        console.log('recipe : ', recipe);
        console.log('actionTimeParams : ', recipe.actionTimeParams);
        actionCount = response.data['count'];
        time = response.data['time'];
        actionTime = response.data['actiontime']
        recipeTime = response.data['recipetime']
        dataMart(response, actionCount, time);
      });

    console.log('recipe.nerText : ', recipe.nerText);
    console.log('recipeTimeData : ', recipeTimeData);
    console.log('actionTimeParams : ', actionTimeParams);
  };

  const generateActionTimeMap = (src, dst) => {
    let computeTime;
    let computeActionTimeMap = src.map((sourceitem, sourceindex) => {
      let filterByActionKey = dst.filter((dstitem, dstindex) => {
        if (sourceitem['action'] === dstitem['action']) {
          return true;
        }
        else {
          return false;
        }
      });
      console.log('sourceitem : ', sourceitem);
      console.log('undefined filterByActionKey : ', filterByActionKey);
      console.log('finlterByActionKey["0"] : ', filterByActionKey[0]);
      if (filterByActionKey[0] === undefined) {
        computeTime = 0;
      }
      else {
        computeTime = sourceitem['count'] * filterByActionKey[0]['time'];
      }
      
      return { 'action': sourceitem['action'], 'time': computeTime };
    });
    return computeActionTimeMap;
  }

  const dataMart = (response, actionCount, time) => {
    let computeActionTimeMap;
    if (recipe.actionTimeParams === undefined) {
      console.log('undefined : ', response.data['params']);
      computeActionTimeMap = generateActionTimeMap(actionCount, response.data['params']);
      console.log('undefined computeActionTime : ', computeActionTimeMap);

      setRecipe((recipe) => ({
        ...recipe,
        recipeTimeData: computeActionTimeMap,
        expectedTime: time,
        actionCount: actionCount,
        actionTime: response.data['actiontime'],
        recipeTime: response.data['recipetime'],
        actionTimeParams: response.data['params'],
        actionTimeInRecipe: computeActionTimeMap
      }));

      return ;
    }
    else {
      console.log('not undefined : ', recipe.actionTimeParams);
      computeActionTimeMap = generateActionTimeMap(recipe.actionCount, recipe.actionTimeParams);
      console.log('undefined computeActionTime : ', computeActionTimeMap);

      setRecipe((recipe) => ({
        ...recipe,
        recipeTimeData: computeActionTimeMap,
        expectedTime: time,
        actionTime: actionTime,
        recipeTime: recipeTime,
        actionTimeParams: recipe.actionTimeParams,
        actionTimeInRecipe: computeActionTimeMap
      }));

      return ;
    }
  };

  const fetchRecipeLevel = () => {
    let data = recipe.ingredientsList;
    let wakati = recipe.wakatiText;
    axios.post(POST_URL + '/level', {
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
    console.log('recipe : ', recipe);
  }

  const readJson = () => {
    axios.post(POST_URL + '/read', {
      method: 'POST',
      data: recipe,
      headers: {
        'Content-Types': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
      .then((response) => {
        console.log('response : ', response);
        setRecipe((recipe) => ({
          ...recipe,
          ingredientsList: response.data.data['ingredientsList'],
          originalRecipe: response.data.data['originalRecipe'],
          annotatedRecipe: response.data.data['annotatedRecipe'],
          recipeTimeData: response.data.data['recipeTimeData'],
          recipeLevelData: response.data.data['recipeLevelData'],
          nerText: response.data.data['nerText'],
          wakatiText: response.data.data['wakatiText'],
          expectedTime: response.data.data['expectedTime'],
          actionTimeParams: response.data.data['actionTimeParams'],
          selectedAction: response.data.data['selectedAction'],
          selectedActionTime: response.data.data['selectedActionTime'],
          actionCount: response.data.data['actionCount'],
          actionTimeInRecipe: response.data.data['actionTimeInRecipe'],
          actionTime: response.data.data['actionTime'],
          recipeTime: response.data.data['recipeTime'],
        }));
        console.log('recipe : ', recipe);
      });

    return ;
  }
  const outputJson = () => {
    axios.post(POST_URL + '/output', {
      method: 'POST',
      data: recipe,
      headers: {
        'Content-Types': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }

  const recipeTest = () => {
    console.log('recipeTest/recipe : ', recipe);
  }

  return (
    <div>
      <button onClick={postRecipe}>レシピ</button>
      <button onClick={fetchTimeData}>時間</button>
      <button onClick={fetchRecipeLevel}>レベル</button>
      <button onClick={readJson}>読込</button>
      <button onClick={outputJson}>保存</button>
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
        <form id="actionTimeParams">
          <select
            name="selectedAction"
            value={recipe.selectedAction}
            id="selectedAction"
            onChange={handleChange}
          >
            {recipe.actionTimeParams === undefined
             ? null
             : recipe.actionTimeParams.map((param) => (
               <option key={param}>{param.action}</option>
             ))
            }
          </select>
          <input
            name="selectedActionTime"
            value={recipe.selectedActionTime}
            id="selectedActioTime"
            onChange={parameterChange}
          />
        </form>

        <div className="chartCell">
          <div className="expectedTime">
            調理推定時間<span className="numberOfTime">{recipe.expectedTime}</span>分
          </div>
          <div className="expectedTime">
            AC時間<span className="numberOfTime">{recipe.actionTime}</span>分
          </div>
          <div className="expectedTime">
            レシピ時間<span className="numberOfTime">{recipe.recipeTime}</span>分
          </div>
          <BarChartWrapper
            data={recipe.recipeTimeData}
          />
          <BarChartWrapper
            data={recipe.actionTimeParams}
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
