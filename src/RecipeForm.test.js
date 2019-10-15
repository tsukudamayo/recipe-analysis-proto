import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';

import { RecipeForm } from './RecipeForm';
import { createContainer } from './domManipulators';

describe('RecipeForm', () => {
  let render, container;

  beforeEach(() => {
    ({ render, container } = createContainer());
  });

  const expectToBeTextareaFieldOfTypeText = (formElement) => {
    expect(formElement).not.toBeNull();
    expect(formElement.tagName).toEqual('TEXTAREA');
    expect(formElement.type).toEqual('textarea');
  };

  const form = (id) => container.querySelector(`form[id="${id}"]`);
  const field = (name) => form('recipe').elements[name];
  const labelFor = (formElement) => container.querySelector(`label[for="${formElement}"]`);

  it('renders a form', () => {
    render(<RecipeForm />);
    expect(container.querySelector('form[id="recipe"]')).not.toBeNull();
  });

  it('has two submit button', () => {
    render(<RecipeForm />);
    const submitButton = container.querySelectorAll('input[type="submit"]');
    expect(submitButton).not.toBeNull();
    expect(submitButton).toHaveLength(2);
    expect(submitButton[0].value).toMatch('実行');
    expect(submitButton[1].value).toMatch('保存');
  });

  const itRendersAsTextBox = (fieldName) => {
    it('renders as a text box', () => {
      render(<RecipeForm />);
      expectToBeTextareaFieldOfTypeText(field(fieldName));
    });
  };
  const itIncludesTheExistingValue = (fieldName) => {
    it('includes the existing empty value ', () => {
      render(<RecipeForm />);
      expect(field(fieldName).value).toEqual('');
    });
  };
  const itRendersALabel = (fieldName, text) => {
    it('renders a label', () => {
      render(<RecipeForm />);
      expect(labelFor(fieldName)).not.toBeNull();
      expect(labelFor(fieldName).textContent).toEqual(text);
    });
  };
  const itAssingsAnLabelId = (fieldName) => {
    it('assings an id that matches the label id', () => {
      render(<RecipeForm />);
      expect(field(fieldName).id).toEqual(fieldName);
    });
  };
  const itSubmitsExistingValue = (fieldName, value) => {
    it('saves existing value when submitted', async() => {
      expect.hasAssertions();
      render(
        <RecipeForm
          {...{ [fieldName]: value } }
          onSubmit={(props) => expect(props[fieldName]).toEqual(value)}
        />
      );
      await ReactTestUtils.Simulate.submit(form('recipe'));
    });
  };
  const itSubmitsNewValue = (fieldName, value) => {
    it('saves new value when submitted', async() => {
      expect.hasAssertions();
      render(
        <RecipeForm
          {...{ [fieldName]: '' } }
          onSubmit={(props) => expect(props[fieldName]).toEqual(value)}
        />
      );
      await ReactTestUtils.Simulate.change(
        field(fieldName),
        {
          target: {
            value: value,
            name: fieldName
          }
        }
      );
      await ReactTestUtils.Simulate.submit(form('recipe'));
    });
  };

  describe('ingredients list field', () => {
    itRendersAsTextBox('ingredientsList');
    itIncludesTheExistingValue('ingredientsList');
    itRendersALabel('ingredientsList', '材料');
    itAssingsAnLabelId('ingredientsList');
    itSubmitsExistingValue('ingredientsList', 'ステーキ用赤身肉　4枚');
    itSubmitsNewValue('ingredientsList', 'ごま油　大さじ1/2');
  });

  describe('original recipe field', () => {
    itRendersAsTextBox('originalRecipe');
    itIncludesTheExistingValue('originalRecipe');
    itRendersALabel('originalRecipe', '作り方');
    itAssingsAnLabelId('originalRecipe');
    itSubmitsExistingValue('originalRecipe', 'バットなど平らな容器に漬け汁の材料を合わせる。');
    itSubmitsNewValue('originalRecipe', 'にんにくの茎、エシャロット、しめじはさっと塩ゆでする。');
  });
});
