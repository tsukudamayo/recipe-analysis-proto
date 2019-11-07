import React, { useState } from 'react';
import Loader from 'react-loader-spinner';
import axios from 'axios';

import { RadarChartWrapper } from './RadarChartWrapper';
import { BarChartWrapper } from './BarChartWrapper';
import { sampleRecipeName } from './sampleRecipeName.js';

import './RecipeForm.css'

const POST_URL = 'http://localhost:5000'
// const POST_URL = 'https://sampleweekcookdatapotal.azurewebsites.net'
// const POST_URL = 'http://23.100.108.226:5000'

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
    const newActionTimeParams = recipe.actionTimeParams;
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
      [target.name]: target.value,
      recipeTimeData: newActionTimeInRecipe,
      actionTimeParams: newActionTimeParams,
      actionTime: summationActionTime,
      expectedTime: evaluationRecipeTime
    }));
  };

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
    let lf = /\r?\n/g;
    let br = '<br>';
    let lfToBR = joinColoredText.replace(lf, br);
    console.log('joinColoredText : ', joinColoredText);
    console.log('lfToBR : ', lfToBR);

    return lfToBR;
  };

  const fetchTimeData = () => {
    let data = recipe.nerText
    let time;
    let actionTime;
    let recipeTime;
    let actionCount;
    let initTimeParams;
    let filterByActionKey;
    let computeActionTimeMap;
    axios.post(POST_URL + '/time', {
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
        console.log('actionTimeParams : ', recipe.actionTimeParams);
        actionCount = response.data['count'];
        time = response.data['time'];
        actionTime = response.data['actiontime']
        recipeTime = response.data['recipetime']

        const timeParams = () => {
          let countData;
          let timeData;
          let targetIndex;
          let computeTime;
          if (recipe.actionTimeParams === undefined) {
            console.log('undefined : ', response.data['params']);
            computeActionTimeMap = actionCount.map((sourceitem, sourceindex) => {
              filterByActionKey = response.data['params'].filter((dstitem, dstindex) => {
                if (sourceitem['action'] === dstitem['action']) {
                  return true;
                }
                else {
                  return false;
                }
              });
              console.log('sourceitem : ', sourceitem);
              console.log('finlterByActionKey["0"] : ', filterByActionKey[0]);
              if (filterByActionKey[0] === undefined) {
                computeTime = 0;
              }
              else {
                computeTime = sourceitem['count'] * filterByActionKey[0]['time'];
              }
              
              return { 'action': sourceitem['action'], 'time': computeTime };
            });

            console.log('undefined filterByActionKey : ', filterByActionKey);
            console.log('undefined computeActionTime : ', computeActionTimeMap);

            setRecipe((recipe) => ({
              ...recipe,
              actionCount: actionCount,
              actionTimeParams: response.data['params']
            }));
            
            return computeActionTimeMap;
          }
          else {
            console.log('not undefined : ', recipe.actionTimeParams);
            computeActionTimeMap = actionCount.map((sourceitem, sourceindex) => {
              filterByActionKey = recipe.actionTimeParams.filter((dstitem, dstindex) => {
                if (sourceitem['action'] === dstitem['action']) {
                  return true;
                }
                else {
                  return false;
                }
              });
              console.log('sourceitem : ', sourceitem);
              console.log('finlterByActionKey["0"] : ', filterByActionKey[0]);
              if (filterByActionKey[0] === undefined) {
                computeTime = 0;
              }
              else {
                computeTime = sourceitem['count'] * filterByActionKey[0]['time'];
              }
              
              return { 'action': sourceitem['action'], 'time': computeTime };
            });

            console.log('undefined filterByActionKey : ', filterByActionKey);
            console.log('undefined computeActionTime : ', computeActionTimeMap);
            
            return computeActionTimeMap;
          }
        };
        console.log('timeParams : ', timeParams());
        let dataMart = radarChartDataMart(timeParams());
        setRecipe((recipe) => ({
          ...recipe,
          recipeTimeData: dataMart,
          expectedTime: time,
          actionTime: actionTime,
          recipeTime: recipeTime,
          actionTimeInRecipe: timeParams()
        }));
      });

    console.log('recipe.nerText : ', recipe.nerText);
    console.log('recipeTimeData : ', recipeTimeData);
    console.log('actionTimeParams : ', actionTimeParams);
  };

  const radarChartDataMart = (data) => {
    console.log('data:', data);
    const dataMart = Object.keys(data).map((key) => {
      return { action: data[key]['action'], time: data[key]['time'] };
    });
    console.log('dataMart : ', dataMart);
    return dataMart;
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

  const mapActionTimeParams = () => {
    if (recipe.actionTimeParams === undefined) {
      ;
    }
    else {
      Object.keys(recipe.actionTimeParams).map((key) => {
        return recipe.actionTimeParams[key];
      });
    }
    return [];
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
