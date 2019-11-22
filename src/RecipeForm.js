import React, { useState } from 'react';
import Loader from 'react-loader-spinner';
import axios from 'axios';

import { RadarChartWrapper } from './RadarChartWrapper';
import { BarChartWrapper } from './BarChartWrapper';
import { VerticalBarChartWrapper } from './VerticalBarChartWrapper';
import { CustomTooltip } from './CustomTooltip.js';
import { sampleRecipeName } from './sampleRecipeName.js';

import {
  recipeName,
  nameRecipe,
  weekcookStdRecipeData,
  weekcookOrgRecipeData
} from './sampleData';
 
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
  dataList,
  selectedData,
  verticalBarChartTarget,
  verticalBarChartDataMart,
  refferenceCurrentRecipeParams,
  selectedParams,
  radarChartDataMart,
  refferenceRecipeLevel,
  targetRecipeLevel,
  refferenceRecipeParams,
  targetRecipeParams,
  refferenceRecipeID,
  recipeTitle,
  recipeUrl,
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
    dataList,
    selectedData,
    verticalBarChartTarget,
    verticalBarChartDataMart,
    refferenceCurrentRecipeParams,
    selectedParams,
    radarChartDataMart,
    refferenceRecipeLevel,
    targetRecipeLevel,
    refferenceRecipeParams,
    targetRecipeParams,
    refferenceRecipeID,
    recipeTitle,
    recipeUrl,
    loading
  });

  // //////////// //
  // form handler //
  // //////////// //
  const handleChange = ({ target }) => {
    console.log('handleChange');
    console.log('[target.name] : ', [target.name]);
    console.log('target.value : ', target.value);
    setRecipe((recipe) => ({
      ...recipe,
      [target.name]: target.value
    }));
    switch(target.name) {
    case 'selectedActionTime':
      parameterHandler(target);
      break;
    case 'selectedParams':
      createVerticalBarChartDataMart(recipe.recipeLevelData, target.value);
      break;
    default:
      ;
      break;
    }
  };

  const computeLevel = (parameters) => {
    return Math.round(parameters.reduce((a,b) => a > b ? a : b)*10)/10;
  };

  const refferenceChange = ({ target }) => {
    console.log('refferenceChange');
    console.log('[target.name] : ', [target.name]);
    console.log('target.value : ', target.value);
    let targetName = [target.name][0];
    let targetValue = target.value;
    let refferenceID = nameRecipe[0][targetValue];
    let refRecipeLevel = recipe.refferenceRecipeLevel;
    let refRecipeParams = recipe.refferenceRecipeParams;

    console.log('targetName : ', targetName);
    console.log('targetValue : ', targetValue);
    console.log('reffeneceID : ', refferenceID);
    console.log('refRecipeLevel : ', refRecipeLevel);
    console.log('refRecipeParams : ', refRecipeParams);
    
    refRecipeParams = [
      weekcookStdRecipeData[0][refferenceID],
      weekcookStdRecipeData[1][refferenceID],
      weekcookStdRecipeData[2][refferenceID],
      weekcookStdRecipeData[3][refferenceID],
      weekcookStdRecipeData[4][refferenceID]
    ];
    refRecipeLevel = computeLevel(refRecipeParams);

    let refdata = refRecipeParams;
    let dataMart = recipe.radarChartDataMart;
    console.log('refferenceChange/dataMart : ', dataMart);
    dataMart[0].refference = refdata[0];
    dataMart[1].refference = refdata[1];
    dataMart[2].refference = refdata[2];
    dataMart[3].refference = refdata[3];
    dataMart[4].refference = refdata[4];
    let deleteTarget = 'level';
    dataMart.some(function(v, i) {
      if (v.name == deleteTarget) dataMart.splice(i, 1);
    });
    console.log('fetchRecipeLevel/dataMart : ', dataMart);

    console.log('targetName : ', targetName);
    console.log('targetValue : ', targetValue);
    console.log('reffeneceID : ', refferenceID);
    console.log('refRecipeLevel : ', refRecipeLevel);
    console.log('refRecipeParams : ', refRecipeParams);

    setRecipe((recipe) => ({
      ...recipe,
      [target.name]: target.value,
      refferenceRecipeID: refferenceID,
      refferenceRecipeLevel: refRecipeLevel,
      refferenceRecipeParams: refRecipeParams,
      radarChartDataMart: dataMart
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

  // //////////// //
  // POST request //
  // //////////// //
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

  // /////////////////////// //
  // render recipe and graph //
  // /////////////////////// //
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
        recipeTimeDataMart(response, actionCount, time);
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

  const recipeTimeDataMart = (response, actionCount, time) => {
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
        console.log('fetchRecipeLevel/recipe.refferenceRecipeParams : ', recipe.refferenceRecipeParams);
        let refdata;
        if (recipe.refferenceRecipeParams == undefined) {
          refdata = [0, 0, 0, 0, 0];
        }
        else {
          refdata = recipe.refferenceRecipeParams;
        }
        console.log('fetchRecipeLevel/refdata : ', refdata);
        let dataMart = response.data['data'];
        dataMart[0].refference = refdata[0];
        dataMart[1].refference = refdata[1];
        dataMart[2].refference = refdata[2];
        dataMart[3].refference = refdata[3];
        dataMart[4].refference = refdata[4];
        dataMart.pop();
        console.log('fetchRecipeLevel/dataMart : ', dataMart);

        setRecipe((recipe) => ({
          ...recipe,
          recipeLevelData: response.data['data'],
          radarChartDataMart: dataMart
        }));
        createVerticalBarChartDataMart(response.data['data'], 'ingredients');
      });
      
  };

  const verifyValue = () => {
    console.log(recipe.recipeTimeData);
    console.log('recipe : ', recipe);
  };

  // /////////////// //
  // read and output //
  // /////////////// //
  const readJson = () => {
    console.log('recipe : ', recipe);
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
          recipeTitle: response.data.data['recipeTitle'],
          recipeUrl: response.data.data['recipeUrl']
        }));
        console.log('recipe : ', recipe);
      });

    return ;
  };

  const outputJson = () => {
    console.log('recipe : ', recipe);
    axios.post(POST_URL + '/output', {
      method: 'POST',
      data: recipe,
      headers: {
        'Content-Types': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }

  // ////////////////////////////// //
  // for select save data file name //
  // ////////////////////////////// //
  const displayDataList = () => {
    axios.post(POST_URL + '/select', {
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
          dataList: response.data['data']
        }));
      })
  };

  // //////////////////////////////////////// //
  // for dataMart for render verticalBarChart //
  // //////////////////////////////////////// //
  const createVerticalBarChartDataMart = (response, param) => {
    let targetElement;
    let refference;
    let refferenceObject;
    let targetRecipeLevel = recipe.targetRecipeLevel;
    let targetRecipeParams = recipe.targetRecipeParams;

    const parameterNameMap = {
      'ingredients': '食材',
      'sentences': '文字数',
      'heat': '加熱',
      'mix': '混ぜる',
      'cut': '切る',
      'level': 'レベル'
    };

    console.log('recipe.verticalBarChartTarget : ', recipe.verticalBarChartTarget);
    console.log('recipe.selectedParams : ', recipe.selectedParams);
    targetElement = param;
      
    let dataForVisualize = Object.keys(recipeName[0]).map((key) => {
      return {
        "name": recipeName[0][key],
        "ingredients": weekcookStdRecipeData[0][key],
        "sentences": weekcookStdRecipeData[1][key],
        "heat": weekcookStdRecipeData[2][key],
        "mix": weekcookStdRecipeData[3][key],
        "cut": weekcookStdRecipeData[4][key],
        "level": weekcookStdRecipeData[5][key],
        "orgingredients": weekcookOrgRecipeData[0][key],
        "orgsentences": weekcookOrgRecipeData[1][key],
        "orgheat": weekcookOrgRecipeData[2][key],
        "orgmix": weekcookOrgRecipeData[3][key],
        "orgcut": weekcookOrgRecipeData[4][key],
      };
    });
    dataForVisualize.sort(function(a, b) {
      if (a[targetElement] > b[targetElement]) return -1;
      if (a[targetElement] < b[targetElement]) return 1;
      return 0;
    });
    console.log('dataForVisualize : ', dataForVisualize);

    console.log('targetElement : ', targetElement);
    const recipeLevelTargetElement = parameterNameMap[targetElement];
    console.log('recipeLevelTargetElement : ', recipeLevelTargetElement);
    console.log('response : ', response);
    console.log('targetElement : ', targetElement);
    refferenceObject = response.filter((item, index) => {
      if(item.key == recipeLevelTargetElement) {
        return true;
      }
      else {
        return false;
      }
    });
    console.log('refferenceObject : ', refferenceObject);
    refference = refferenceObject[0].target;
    console.log('refference : ', refference);

    targetRecipeParams = response;
    console.log('createVerticalBarChartDataMart/targetRecipeParams : ', targetRecipeParams);
    const targetRecipeParamsForLevel = [
      response[0].target,
      response[1].target,
      response[2].target,
      response[3].target,
      response[4].target
    ];
    targetRecipeLevel = computeLevel(targetRecipeParamsForLevel);

    setRecipe((recipe) => ({
      ...recipe,
      verticalBarChartDataMart: dataForVisualize,
      verticalBarChartTarget: param,
      refferenceCurrentRecipeParams: refference,
      targetRecipeLevel: targetRecipeLevel,
      targetRecipeParams: targetRecipeParams
    }));
  };

  const targetKeyForVerticalBarChart = [
    'ingredients', 'sentences', 'heat', 'mix', 'cut', 'level'
  ];

  const selectTargetVerticalBarChart = targetKeyForVerticalBarChart.map((key) => {
    return <option value={key}>{key}</option>;
  });

  const selectRefferenceRecipeName = Object.keys(nameRecipe[0]).map((key) => {
    return <option value={key}>{key}</option>
  });

  // ///////// //
  // for debug //
  // ///////// //
  const recipeTest = () => {
    console.log('nameRecipe : ', nameRecipe[0]);
  };

  // ////////////////////////// //
  // render RecipForm Component //
  // ////////////////////////// //
  return (
    <div>
      <div className="recipeButton">
        <button onClick={recipeTest}>テスト</button>
        <button onClick={postRecipe}>レシピ</button>
        <button onClick={fetchTimeData}>時間</button>
        <button onClick={fetchRecipeLevel}>レベル</button>
      </div>
      <div className="fileButton">
        <button onClick={displayDataList}>選択</button>
        <form id="selectedData">
            <select
              name="selectedData"
              value={recipe.selectedData}
              id="selectedData"
              onChange={handleChange}
            >
              {recipe.dataList === undefined
               ? null
               : recipe.dataList.map((data) => (
                 <option key={data}>{data}</option>
               ))
              }
            </select>
        </form>
        <button onClick={readJson}>読込</button>
        <button onClick={outputJson}>保存</button>
      </div>
      <div className="recipeName">
        <form
          id="recipeName"
        >
          <label>
            名前
          </label>
          <input
            name="recipeTitle"
            value={recipe.recipeTitle}
            id="recipeTitle"
            onChange={handleChange}
            type="text"
            size="40"
          />
          <label>
            URL
          </label>
          <input
            name="recipeUrl"
            value={recipe.recipeUrl}
            id="recipeUrl"
            onChange={handleChange}
            type="text"
            size="40"
          />
        </form>
      </div>
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
            onChange={handleChange}
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
          <form id="refferenceRecipe">
            <select
              name="refferenceRecipe"
              value={recipe.refferenceRecipe}
              id="refferenceRecipe"
              onChange={refferenceChange}
            >
              {nameRecipe=== undefined
               ? null
               : selectRefferenceRecipeName
              }
            </select>
          </form>

          <h2>青: {recipeName[recipe.refferenceRecipeID]} レベル: {recipe.refferenceRecipeLevel}</h2>
          <form>
            <input type="text" name="refference" list="refferenceList" onChange={refferenceChange} autocomplete="on"/>
              <datalist id="refferenceList">
                {selectRefferenceRecipeName}
            </datalist>
          </form>
          
          <h2>赤:  レベル: {recipe.targetRecipeLevel}</h2>


          <RadarChartWrapper
            data={recipe.radarChartDataMart}
            recipename={sampleRecipeName}
          />
          <form id="selectedParams">
              <select
                name="selectedParams"
                value={recipe.selectedParams}
                onChange={handleChange}
              >
                {selectTargetVerticalBarChart === undefined
                 ? null
                 : selectTargetVerticalBarChart
                }
              </select>
          </form>
          <VerticalBarChartWrapper
            data={recipe.verticalBarChartDataMart}
            target={recipe.verticalBarChartTarget}
            refference={recipe.refferenceCurrentRecipeParams}
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
