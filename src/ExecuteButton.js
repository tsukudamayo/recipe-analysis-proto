import React from 'react';

export const ExecuteButton = () => {
  const buttonList = ['実行', '保存'];

  return (
    <div id="executeButton">
      <ol>
        {buttonList.map((element, index) => (
          <li key={index}>
            <button
              type="button"
            >
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
};
