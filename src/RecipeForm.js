import React, { useState } from 'react';

export const RecipeForm = ({
  ingredientsList,
  originalRecipe,
  onSubmit
}) => {
  const [recipe, setRecipe] = useState({
    ingredientsList,
    originalRecipe
  });

  const handleChange = ({ target }) =>
        setRecipe((recipe) => ({
          ...recipe,
          [target.name]: target.value
        }));

  return (
    <form id="recipe" onSubmit={() => onSubmit(recipe)}>
      <input
        type="submit"
        value="実行"
      />
      <input
        type="submit"
        value="保存"
      />
      <br/>
      <label htmlFor="ingredientsList">材料</label>
      <textarea
        name="ingredientsList"
        type="text"
        value={ingredientsList}
        id="ingredientsList"
        onChange={handleChange}
        rows="20"
        cols="50"
      />
      <label htmlFor="originalRecipe">作り方</label>
      <textarea
        name="originalRecipe"
        type="text"
        value={originalRecipe}
        id="originalRecipe"
        onChange={handleChange}
        rows="20"
        cols="50"
      />
    </form>
  );
};
