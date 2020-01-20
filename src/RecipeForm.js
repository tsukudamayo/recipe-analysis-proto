import React, { useState, useEffect } from 'react';
import Loader from 'react-loader-spinner';
import axios from 'axios';

import { RadarChartWrapper } from './RadarChartWrapper';
import { BarChartWrapper } from './BarChartWrapper';
import { VerticalBarChartWrapper } from './VerticalBarChartWrapper';
import { FlowgraphWrapper } from './FlowgarphWrapper';
import { sampleRecipeName } from './sampleRecipeName.js';

import {
  recipeName,
  nameRecipe,
  weekcookStdRecipeData,
  weekcookOrgRecipeData
} from './sampleData';
 
import './RecipeForm.css'

// const POST_URL = 'http://localhost:5000';
// const POST_URL = 'https://sampleweekcookdatapotal.azurewebsites.net';
// const POST_URL = 'http://23.100.108.226:5000';
// const POST_URL = 'http://192.168.99.100:5000';
const POST_URL = 'http://192.168.1.137:5000';

export const RecipeForm = ({
  ingredients,
  recipe,
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
  title,
  url,
  selectedRecipeDataTypes,
  selectedRecipeDataType,
  selectedRecipeDataTypeFiles,
  selectedRecipeDataTypeFile,
  flowGraphData,
  attachAction,
  attachTime,
  sourceRefference,
  loading,
  onSubmit
}) => {
  const [recipes, setRecipes] = useState({
    ingredients,
    recipe,
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
    title,
    url,
    selectedRecipeDataTypes,
    selectedRecipeDataType,
    selectedRecipeDataTypeFiles,
    selectedRecipeDataTypeFile,
    flowGraphData,
    attachAction,
    attachTime,
    sourceRefference,
    loading
  });

  useEffect(() => {
    console.log('render');
    if (recipes.selectedRecipeDataTypeFiles === undefined) {
      fetchRecipeDataFilesForDefaultProps();
    }
    displayDataListForUseEffect();
      
  });

  // //////////// //
  // form handler //
  // //////////// //
  const handleChange = ({ target }) => {
    console.log('handleChange');
    console.log('[target.name] : ', [target.name]);
    console.log('target.value : ', target.value);
    setRecipes((recipes) => ({
      ...recipes,
      [target.name]: target.value
    }));
    switch(target.name) {
    case 'selectedActionTime':
      parameterHandler(target);
      break;
    case 'selectedParams':
      createVerticalBarChartDataMart(recipes.recipeLevelData, target.value);
      break;
    case 'refferenceRecipe':
      refferenceHandler(target);
      break;
    case 'selectedRecipeDataType':
      fetchRecipeDataFiles(target);
      break;
    default:
      ;
      break;
    }
  };

  const fetchRecipeDataFiles = (target) => {
    console.log('fetchRecipeDataFiles');
    console.log('[target.name] : ', [target.name]);
    console.log('target.value : ', target.value);
    axios.post(POST_URL + '/filelist', {
      method: 'POST',
      data: target.value,
      headers: {
        'Content-Types': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    })
      .then((response) => {
        console.log('response : ', response);
        console.log('recipe : ', recipes);
        setRecipes((recipes) => ({
          ...recipes,
          selectedRecipeDataTypeFiles: response.data['data']
        }));
      });
    
  };

  const fetchRecipeDataFilesForDefaultProps = () => {
    axios.post(POST_URL + '/filelist', {
      method: 'POST',
      data: 'betterhome',
      headers: {
        'Content-Types': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    })
      .then((response) => {
        console.log('response : ', response);
	console.log('recipes : ', recipes);
        setRecipes((recipes) => ({
          ...recipes,
          selectedRecipeDataTypeFiles: response.data['data']
        }));
      });
  };

  const computeLevel = (parameters) => {
    return Math.round(parameters.reduce((a,b) => a > b ? a : b)*10)/10;
  };

  const refferenceHandler = (target) => {
    console.log('refferenceHandler');
    console.log('[target.name] : ', [target.name]);
    console.log('target.value : ', target.value);
    let targetName = [target.name][0];
    let targetValue = target.value;
    let refferenceID = nameRecipe[0][targetValue];
    let refRecipeLevel = recipes.refferenceRecipeLevel;
    let refRecipeParams = recipes.refferenceRecipeParams;

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
    let dataMart = recipes.radarChartDataMart;
    console.log('refferenceHandler/dataMart : ', dataMart);
    dataMart[0].refference = refdata[0];
    dataMart[1].refference = refdata[1];
    dataMart[2].refference = refdata[2];
    dataMart[3].refference = refdata[3];
    dataMart[4].refference = refdata[4];
    let deleteTarget = 'level';
    dataMart.some(function(v, i) {
      if (v.name === deleteTarget) dataMart.splice(i, 1);
    });
    console.log('fetchRecipeLevel/dataMart : ', dataMart);

    console.log('targetName : ', targetName);
    console.log('targetValue : ', targetValue);
    console.log('reffeneceID : ', refferenceID);
    console.log('refRecipeLevel : ', refRecipeLevel);
    console.log('refRecipeParams : ', refRecipeParams);

    setRecipes((recipes) => ({
      ...recipes,
      [target.name]: target.value,
      refferenceRecipeID: refferenceID,
      refferenceRecipeLevel: refRecipeLevel,
      refferenceRecipeParams: refRecipeParams,
      radarChartDataMart: dataMart
    }));
  };

  const parameterHandler = (target) => {
    console.log('recipes.selectedAction : ', recipes.selectedAction);
    console.log('recipes.actionTimeParams : ', recipes.actionTimeParams);
    let filterByActionKey;
    let actionTimeParamsID;
    let actionTimeInRecipeID;
    let actionCountID;
    filterByActionKey = recipes.actionTimeParams.filter((item, index) => {
      if (item['action'] === recipes.selectedAction) {
        actionTimeParamsID = index;
        return true;
      }
      else {
        return false;
      }
    });
    console.log('filterByActionKey : ', filterByActionKey);
    console.log('targetIndex : ', actionTimeParamsID);
    console.log('recipes.actionTimeParams : ', recipes.actionTimeParams);
    const newActionTimeParams = recipes.actionTimeParams;
    console.log('newActionTimeParams : ', newActionTimeParams);
    console.log('target.value : ', target.value);
    newActionTimeParams[actionTimeParamsID]['time'] = Number(target.value);

    filterByActionKey = recipes.actionTimeInRecipe.filter((item, index) => {
      if (item['action'] === recipes.selectedAction) {
        actionTimeInRecipeID = index;
        return true;
      }
      else {
        return false;
      }
    });

    filterByActionKey = recipes.actionCount.filter((item, index) => {
      if (item['action'] === recipes.selectedAction) {
        actionCountID = index;
        return true;
      }
      else {
        return false;
      }
    });

    const newActionTimeInRecipe = recipes.actionTimeInRecipe;
    newActionTimeInRecipe[actionTimeInRecipeID]['time'] = Number(target.value) * recipes.actionCount[actionCountID]['count'];
    console.log('newActionTimeInRecipe[targetIndex] : ', newActionTimeInRecipe[actionTimeInRecipeID]);

    const summationActionTime = newActionTimeInRecipe.reduce((a, b) => a + b.time, 0);
    const evaluationRecipeTime = summationActionTime + recipes.recipeTime;
    console.log('newActionTimeParmas : ', newActionTimeParams);

    setRecipes((recipes) => ({
      ...recipes,
      recipeTimeData: newActionTimeInRecipe,
      actionTimeParams: newActionTimeParams,
      actionTime: summationActionTime,
      expectedTime: evaluationRecipeTime
    }));

    return ;
  }

  // //////////////////////////////////////// //
  // for dataMart for render verticalBarChart //
  // //////////////////////////////////////// //
  const createVerticalBarChartDataMart = (response, param) => {
    let targetElement;
    let refference;
    let refferenceObject;
    let targetRecipeLevel = recipes.targetRecipeLevel;
    let targetRecipeParams = recipes.targetRecipeParams;

    const parameterNameMap = {
      'ingredients': '食材',
      'sentences': '文字数',
      'heat': '加熱',
      'mix': '混ぜる',
      'cut': '切る',
      'level': 'レベル'
    };

    console.log('createVerticalBarChartDataMart/response : ', response);
    console.log('recipe.verticalBarChartTarget : ', recipes.verticalBarChartTarget);
    console.log('recipe.selectedParams : ', recipes.selectedParams);
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

    let refferenceRecipeData = [
      response[0].target,
      response[1].target,
      response[2].target,
      response[3].target,
      response[4].target
    ];
    let refferenceRecipeLevel = Math.max.apply(null, refferenceRecipeData);
    let refferenceForVisualize = {
      "name": recipes.title,
      "ingredients": response[0].target,
      "sentences": response[1].target,
      "heat": response[2].target,
      "mix": response[3].target,
      "cut": response[4].target,
      "level": refferenceRecipeLevel,
      "orgingredients": response[0].count,
      "orgsentences": response[1].count,
      "orgheat": response[2].count,
      "orgmix": response[3].count,
      "orgcut": response[4].count
    };

    dataForVisualize.push(refferenceForVisualize);
    console.log('recipes.recipeLevelData : ', recipes.recipeLevelData);

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
      if(item.key === recipeLevelTargetElement) {
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

    setRecipes((recipes) => ({
      ...recipes,
      verticalBarChartDataMart: dataForVisualize,
      verticalBarChartTarget: param,
      refferenceCurrentRecipeParams: refference,
      targetRecipeLevel: targetRecipeLevel,
      targetRecipeParams: targetRecipeParams,
    }));
  };

  // //////////// //
  // POST request //
  // //////////// //
  const postRecipe = () => {
    console.log('body : ', JSON.stringify({'data': recipes.recipe}));
    let data = recipes.recipe;
    setRecipes((recipes) => ({
      ...recipes,
      loading: true
    }));
    console.log('recipe.loading : ', recipes.loading);
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
        console.log('recipes : ', recipes);
        const text = response.data['data'];
        const wakati = response.data['wakati'];
        setRecipes((recipes) => ({
          ...recipes,
          nerText: text,
          wakatiText: wakati,
          annotatedRecipe: generateColorAnnotation(text),
          loading: false
        }));
        console.log('recipe.loading : ', recipes.loading);
      });

    return ;
  };

  // /////////////////////// //
  // render recipe and chart //
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
    let ner = recipes.nerText;
    let wakati = recipes.wakatiText;
    console.log('actionTimeParams : ', recipes.actionTimeParams);

    if (recipes.actionTimeParams === undefined) {
      console.log('undefined fetchTimeData');
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
          console.log('recipes : ', recipes);
          console.log('actionTimeParams : ', recipes.actionTimeParams);
          actionCount = response.data['count'];
          time = response.data['time'];
          // actionTime = response.data['actiontime']
          // recipeTime = response.data['recipetime']
          recipeTimeDataMart(response, actionCount, time);
        });
    }
    else {
      console.log('not undefined timeFetchData');
      // time = recipes.recipeTimeData.reduce((t, x) => t + x.time, 0);
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
          console.log('recipe : ', recipes);
          console.log('actionTimeParams : ', recipes.actionTimeParams);
          actionCount = response.data['count'];
          time = response.data['time'];
          recipeTimeDataMart(response, actionCount, time);
        });
    }

    console.log('recipe.nerText : ', recipes.nerText);
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
    console.log('recipes.actionTimeParams : ', recipes.actionTimeParams);
    console.log('recipTimeDataMart/actionCount : ', actionCount);
    if (recipes.actionTimeParams === undefined) {
      console.log('undefined : ', response.data['params']);
      computeActionTimeMap = generateActionTimeMap(actionCount, response.data['params']);
      console.log('undefined computeActionTime : ', computeActionTimeMap);

      setRecipes((recipes) => ({
        ...recipes,
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
      console.log('not undefined : ', recipes.actionTimeParams);
      computeActionTimeMap = generateActionTimeMap(actionCount, recipes.actionTimeParams);
      console.log('not undefinde : ', recipes.actionTimeParams);
      console.log('not undefined computeActionTime : ', computeActionTimeMap);
      let newActionTime = computeActionTimeMap.reduce((t, x) => t + x.time, 0);
      let newExpectedTime = newActionTime + response.data['recipetime'];

      setRecipes((recipes) => ({
        ...recipes,
        recipeTimeData: computeActionTimeMap,
        expectedTime: newExpectedTime,
        actionCount: actionCount,
        actionTime: newActionTime,
        recipeTime: response.data['recipetime'],
        actionTimeParams: recipes.actionTimeParams,
        actionTimeInRecipe: computeActionTimeMap
      }));

      return ;
    }
  };

  const fetchRecipeLevel = () => {
    let data = recipes.ingredients;
    let wakati = recipes.wakatiText;
    
    axios.post(POST_URL + '/level', {
      method: 'POST',
      data: [data, wakati],
      headers: {
        'Content-Types': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
      .then((response) => {
        console.log('fetchRecipeLevel/response : ', response);
        console.log('retchRecipeLevel/recipes : ', recipes);
        console.log('retchRecipeLevel/data: ', response.data['data']);
        console.log('fetchRecipeLevel/recipes.refferenceRecipeParams : ', recipes.refferenceRecipeParams);
        let refdata;
        if (recipes.refferenceRecipeParams === undefined) {
          refdata = [0, 0, 0, 0, 0];
        }
        else {
          refdata = recipes.refferenceRecipeParams;
        }
        console.log('fetchRecipeLevel/refdata : ', refdata);
        let allData = response.data['data'];
        console.log('fetchRecipeLevel/allData : ', allData);
        let dataMart = response.data['data'];
        dataMart[0].refference = refdata[0];
        dataMart[1].refference = refdata[1];
        dataMart[2].refference = refdata[2];
        dataMart[3].refference = refdata[3];
        dataMart[4].refference = refdata[4];
        dataMart.splice(5, 1);
        console.log('fetchRecipeLevel/dataMart : ', dataMart);

        setRecipes((recipes) => ({
          ...recipes,
          recipeLevelData: allData,
          radarChartDataMart: dataMart
        }));
        createVerticalBarChartDataMart(allData, 'ingredients');
      });
  };

  // /////////////// //
  // read and output //
  // /////////////// //
  const readJson = () => {
    console.log('recipes : ', recipes);
    axios.post(POST_URL + '/read', {
      method: 'POST',
      data: recipes,
      headers: {
        'Content-Types': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
      .then((response) => {
        console.log('response : ', response);
        setRecipes((recipes) => ({
          ...recipes,
          ingredients: response.data.data['ingredients'],
          recipe: response.data.data['recipe'],
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
          title: response.data.data['title'],
          url: response.data.data['url']
        }));
        console.log('recipes : ', recipes);
      });

    return ;
  };

  const outputJson = () => {
    console.log('recipes : ', recipes);
    axios.post(POST_URL + '/output', {
      method: 'POST',
      data: recipes,
      headers: {
        'Content-Types': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  const importData = () => {
    console.log('recipes : ', recipes);
    axios.post(POST_URL + '/import', {
      method: 'POST',
      data: recipes,
      headers: {
        'Content-Types': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
      .then((response) => {
        console.log('response : ', response);
        console.log('response.data.data["ingredients"] : ', response.data.data['ingredients']);
        setRecipes((recipes) => ({
          ...recipes,
          ingredients: objectToIngredientsText(response.data.data['ingredients']),
          recipe: response.data.data['recipe'],
          url: response.data.data['url'],
          title: response.data.data['title']
        }));
      });
  }

  const objectToIngredientsText = (ingredientsObject) => {
    let outputText = '';
    Object.keys(ingredientsObject).forEach(function(key, idx) {
      console.log('key : ', key);
      console.log('v : ', ingredientsObject[key]);
      outputText += key;
      outputText += '　';
      outputText += ingredientsObject[key];
      outputText += '\n';
    });
    console.log('outputText : ', outputText);

    return outputText;
  };

  // ////////////////////////////// //
  // for select save data file name //
  // ////////////////////////////// //
  const displayDataList = () => {
    axios.post(POST_URL + '/select', {
      method: 'POST',
      data: recipes,
      headers: {
        'Content-Types': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
      .then((response) => {
        console.log('response : ', response);
        setRecipes((recipes) => ({
          ...recipes,
          dataList: response.data['data']
        }));
      });
  };

  const displayDataListForUseEffect = () => {
    axios.post(POST_URL + '/select', {
      method: 'POST',
      data: recipes,
      headers: {
        'Content-Types': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
      .then((response) => {
        console.log('response : ', response);
	console.log('response.data["data"] : ', response.data['data']);
        setRecipes((recipes) => ({
          ...recipes,
          selectedRecipeDataTypes: response.data['data']
        }));
      });
  };

  // ///////////////////////// //
  // fetch data for flowGarph //
  // //////////////////////// //
  const fetchFlowGraphData = () => {
    axios.post(POST_URL + '/flowgraph', {
      method: 'POST',
      data: recipes,
      headers: {
        'Content-Types': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
      .then((response) => {
        console.log('response : ', response);
        setRecipes((recipes) => ({
          ...recipes,
          flowGraphData: response.data['data']
        }));
      });
  };

  // ///////// //
  // for debug //
  // ///////// //
  const recipeTest = () => {
    console.log('nameRecipe : ', nameRecipe[0]);
  };

  // //////// //
  // for html //
  // //////// //
  const targetKeyForVerticalBarChart = [
    'ingredients', 'sentences', 'heat', 'mix', 'cut', 'level'
  ];

  const selectTargetVerticalBarChart = targetKeyForVerticalBarChart.map((key) => {
    return <option value={key}>{key}</option>;
  });

  const selectRefferenceRecipeName = Object.keys(nameRecipe[0]).map((key) => {
    return <option value={key}>{key}</option>;
  });

  // duplicated
  // const recipeDataType = [
  //   'orangepage', 'betterhome'
  // ];

  const selectRecipeDataType = () => {
    if (recipes.selectedRecipeDataType !== undefined) {
      console.log('recipe.selectedRecipeDataTypes : ', recipes.selectedRecipeDataTypes);
      console.log('recipes.selectedRecipeDataType : ', recipes.selectedRecipeDataType);
      recipes.selectedRecipeDataTypes.map((key, index) => {
	return <option value={key}>{key}</option>;
      });
    }
  };

  const displayRecipeSource = () => {
    console.log('recipes.recipeDataType : ', recipes.selectedRecipeDataType);
    if (recipes.selectedRecipeDataType !== undefined) {
      return `出典: ${recipes.selectedRecipeDataType}`;
    }
    return '出典: 不明';
  };

  const attachActionParams = () => {
    console.log('attachActionParams');
    let params = recipe.actionTimeParams;
    console.log('orgParams : ', params);
    let action = recipes.attachAction;
    console.log('action : ', action);
    let time = recipes.attachTime;
    console.log('time : ', time);
    let attachParams = {};
    attachParams.action = action;
    attachParams.time = Number(time);
    params.push(attachParams);
    console.log('newParams : ', params);

    setRecipes((recipes) => ({
      ...recipes,
      actionTimeParams: params
    }));

    fetchTimeData();
    outputAttachActionParams();

    return ;
  };

  const outputAttachActionParams = () => {
    console.log('recipes : ', recipes);
    axios.post(POST_URL + '/attachac', {
      method: 'POST',
      data: recipes.actionTimeParams,
      headers: {
        'Content-Types': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

    return ;
  };

  const resetActionParams = () => {
    axios.post(POST_URL + '/resetparams', {
      method: 'POST',
      headers: {
        'Content-Types': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  const testActionTimeParams = () => {
    console.log('test actionTimeParams : ', recipes.actionTimeParams);
    console.log('test : ', recipes.recipeTimeData);
    let data = recipes.recipeTimeData;
    data.push({'action': 'action', 'time': 10});
    console.log('data : ', data);
    setRecipes((recipes) => ({
      ...recipes,
      recipeTimeData: data
    }));
  };

  // ////////////////////////// //
  // render RecipForm Component //
  // ////////////////////////// //
  return (
    <div>
      <div className="recipeButton">
        <button onClick={postRecipe}>レシピ</button>
        <button onClick={fetchTimeData}>時間</button>
        <button onClick={fetchRecipeLevel}>レベル</button>
        <button onClick={fetchFlowGraphData}>グラフ</button>
        <button onClick={testActionTimeParams}>テスト</button>
      </div>
      <div className="fileButton">
      <button onClick={importData}>読込</button>
        <button onClick={outputJson}>保存</button>
      </div>
      <div  className="importData">
        <form id="selectedRecipeDataType">
          <select
            name="selectedRecipeDataType"
            value={recipes.selectedRecipeDataType}
            id="selectedRecipeDataType"
            onChange={handleChange}
          >
            {recipes.selectedRecipeDataTypes === undefined
             ? null
             : recipes.selectedRecipeDataTypes.map((key, index) => (
               <option value={key}>{key}</option>
	     ))}
          </select>
          <select
            name="selectedRecipeDataTypeFile"
            value={recipes.selectedRecipeDataTypeFile}
            id="selectedRecipeDataTypeFile"
            onChange={handleChange}
          >
            {recipes.selectedRecipeDataTypeFiles === undefined
             ? null
             : recipes.selectedRecipeDataTypeFiles.map((key, index) => (
		 <option key={key}>{key}</option>
	     ))
            }
          </select>
        </form>
      </div>
      <div className="recipeName">
        <form
          id="recipeName"
        >
          <label>
            名前
          </label>
          <input
            name="title"
            value={recipes.title}
            id="title"
            onChange={handleChange}
            type="text"
            size="40"
          />
          <label>
            URL
          </label>
          <input
            name="url"
            value={recipes.url}
            id="url"
            onChange={handleChange}
            type="text"
            size="40"
          />
          <label>
            出典
          </label>
          <input 
            type="text"
            name="sourceRefference" 
            list="sourceRefferenceList"
            onChange={handleChange}
          />
            <datalist id="sourceRefferenceList">
              { recipes.selectedRecipeDataType === undefined
               ? null
	       : selectRecipeDataType
	      }

            </datalist>
        </form>
        <h2>
          {recipes.url === undefined
           ? null
           : displayRecipeSource()
          }
        </h2>
      </div>
      <form id="recipes" onSubmit={() => onSubmit(recipes)}>
        <div className="formTable">
          <div className="recipeLabels">
            <p><label htmlFor="ingredients">材料</label></p>
            <textarea
              name="ingredients"
              type="text"
              value={recipes.ingredients}
              id="ingredients"
              onChange={handleChange}
              className="recipeForms"
              rows="20"
              cols="50"
            />
          </div>
          <div className="recipeLabels">
            <p><label htmlFor="recipe">作り方</label></p>
            <textarea
              name="recipe"
              type="text"
              value={recipes.recipe}
              id="recipe"
              onChange={handleChange}
              className="recipeForms"
              rows="20"
              cols="50"
            />
          </div>
        </div>
      </form>

      <div className="resultRendering">
        <form id="selectedAction">
          <label>Action 時間変更</label>
          <select
            name="selectedAction"
            value={recipes.selectedAction}
            id="selectedAction"
            onChange={handleChange}
          >
            {recipes.actionTimeParams === undefined
             ? null
             : recipes.actionTimeParams.map((param) => (
               <option key={param}>{param.action}</option>
             ))
            }
          </select>

          <input
            name="selectedActionTime"
            value={recipes.selectedActionTime}
            id="selectedActionTime"
            onChange={handleChange}
          />
        </form>
        <form>
          <label>Action 追加</label>
          <input
            name="attachAction"
            value={recipes.attachAction}
            id="attachAction"
            onChange={handleChange}
          />
          <label>時間 追加</label>
          <input
            name="attachTime"
            value={recipes.attachTime}
            id="attachTime"
            onChange={handleChange}
          />
        </form>
        <button onClick={attachActionParams}>Action 追加</button>
        <button onClick={resetActionParams}>追加したActionをリセット</button>

        <div className="chartCell">
          <div className="expectedTime">
            調理推定時間<span className="numberOfTime">{recipes.expectedTime}</span>分
          </div>
          <div className="expectedTime">
            AC時間<span className="numberOfTime">{recipes.actionTime}</span>分
          </div>
          <div className="expectedTime">
            レシピ時間<span className="numberOfTime">{recipes.recipeTime}</span>分
          </div>
          <BarChartWrapper
            data={recipes.recipeTimeData}
          />
          <BarChartWrapper
            data={recipes.actionTimeParams}
          />

          <form id="refferenceRecipe">
            <select
              name="refferenceRecipe"
              value={recipes.refferenceRecipe}
              id="refferenceRecipe"
              onChange={handleChange}
            >
              {nameRecipe === undefined
               ? null
               : selectRefferenceRecipeName
              }
            </select>
          </form>

          <h2>青: {recipeName[0][recipes.refferenceRecipeID]} レベル: {recipes.refferenceRecipeLevel}</h2>
          <h2>赤: {recipes.title === undefined ? null : recipes.title} レベル: {recipes.targetRecipeLevel}</h2>

          <RadarChartWrapper
            data={recipes.radarChartDataMart}
            recipename={sampleRecipeName}
          />
          <form id="selectedParams">
              <select
                name="selectedParams"
                value={recipes.selectedParams}
                onChange={handleChange}
              >
                {selectTargetVerticalBarChart === undefined
                 ? null
                 : selectTargetVerticalBarChart
                }
              </select>
          </form>
          <VerticalBarChartWrapper
            data={recipes.verticalBarChartDataMart}
            target={recipes.verticalBarChartTarget}
            refferenceValue={recipes.refferenceCurrentRecipeParams}
    refferenceName={recipes.title === undefined ? "recipename" : recipes.title}
          />
        </div>

        <div className="flowGraph">
          {recipes.flowGraphData === undefined
           ? null
           : <FlowgraphWrapper data={recipes.flowGraphData}/>
          }
        </div>

        <div className="recipeForms">
          {recipes.loading
           ? <Loader type="Watch"/>
           : <div id="annotatedRecipe" dangerouslySetInnerHTML={{__html: recipes.annotatedRecipe}}/>
          }
        </div>
      </div>
    </div>
  );
};

RecipeForm.defaultProps = {
  selectedRecipeDataType: 'betterhome',
  selectedRecipeDataTypeFile: 'ミートパイ.json'
};
