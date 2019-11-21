import React from 'react';

export const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload != null && payload[0] !== undefined) {
    return (
      <div className="custom-tooltip" style={tooltipBGStyle}>
        <p className="key">{label}</p>
        <p className="level" style={tooltipFontStyle}>{` レベル : ${payload[0].value}`}</p>
        {fetchKeyDynamic(payload)}
      </div>
    );
  }
  return null;
};

const tooltipBGStyle = {
  background: "#ffffff",
  padding: "20px"
};

const tooltipFontStyle = {
  color: "#8884d8"
};

const fetchKeyDynamic = (payload) => {
  let tooltipElements = [];
  switch(payload[0].dataKey) {
  case 'ingredients':
    tooltipElements.push(`食材 : ${payload[0].payload.orgingredients}`);
    break;
  case 'sentences':
    tooltipElements.push(`レシピ文字数 : ${payload[0].payload.orgsentences}`);
    break;
  case 'heat':
    tooltipElements.push(`加熱 : ${payload[0].payload.orgheat}`);
    break;
  case 'mix':
    tooltipElements.push(`混ぜる : ${payload[0].payload.orgmix}`);
    break;
  case 'cut':
    tooltipElements.push(`切る : ${payload[0].payload.orgcut}`);
    break;
  case 'level':
    tooltipElements.push(`食材 : ${payload[0].payload.orgingredients}`);
    tooltipElements.push(`レシピ文字数 : ${payload[0].payload.orgsentences}`);
    tooltipElements.push(`加熱 : ${payload[0].payload.orgheat}`);
    tooltipElements.push(`混ぜる : ${payload[0].payload.orgmix}`);
    tooltipElements.push(`切る : ${payload[0].payload.orgcut}`);
    break;
  default:
    break;
  }
  let displayElements = tooltipElements.map((element, key) => {
    return (<p key={key} style={tooltipFontStyle}>{element}</p>);
  });

  return displayElements;
};
