import React, { useState } from 'react';
import axios from 'axios';

export const RecipeForm = ({
  ingredientsList,
  originalRecipe,
  annotatedRecipe,
  onSubmit
}) => {
  const [recipe, setRecipe] = useState({
    ingredientsList,
    originalRecipe,
    annotatedRecipe
  });

  const handleChange = ({ target }) => {
        setRecipe((recipe) => ({
          ...recipe,
          [target.name]: target.value
        }));
    console.log('recipe.originalRecipe: ', recipe.originalRecipe);
  }

  const postData = () => {
    console.log('body : ', JSON.stringify({'data': recipe.originalRecipe}));
    const data = recipe.originalRecipe
    axios.post('http://localhost:5000', {
      method: 'POST',
      data: data,
      headers: { 'Content-Types': 'application/json' }
    })
      .then((response) => {
        console.log('response : ', response);
        console.log('recipe : ', recipe);
        let text = response.data['data'];
        setRecipe((recipe) => ({
          ...recipe,
          annotatedRecipe: colorAnnotate(text)
        }));
      });
    console.log('recipe : ', recipe);

    return ;
  }

  const colorAnnotate = (text) => {
    let textToWakatiList = text.split(' ');
    console.log('textToWakatiList : ', textToWakatiList);
    let colorStringsList = textToWakatiList.map((strings) => {
      if (strings.indexOf('/Ac') != -1) {
        return '<font color="orange">' + strings + '</font>';
      }
      else if (strings.indexOf('/F') != -1) {
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

  return (
    <div>
      <button onClick={postData}>実行</button>
      <button onClick={colorAnnotate}>保存</button>
      <form id="recipe" onSubmit={() => onSubmit(recipe)}>
        <br/>
        <label htmlFor="ingredientsList">材料</label>
        <textarea
          name="ingredientsList"
          type="text"
          value={recipe.ingredientsList}
          id="ingredientsList"
          onChange={handleChange}
          rows="20"
          cols="50"
        />
        <label htmlFor="originalRecipe">作り方</label>
        <textarea
          name="originalRecipe"
          type="text"
          value={recipe.originalRecipe}
          id="originalRecipe"
          onChange={handleChange}
          rows="20"
          cols="50"
        />
      </form>
      <div dangerouslySetInnerHTML={{__html: recipe.annotatedRecipe}}/>
    </div>
  );
};
