import { createGlobalStyle } from 'styled-components';
import nexafont from '../fonts/Nexa-Book.ttf';

export default createGlobalStyle<{theme: any}>`
  @font-face {
    font-family: 'Grift';
    src:
      local('Grift'),
      local('GRIFT'),
      local('Grift Regular'),
      url(${nexafont}) format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'Nexa-Book';
    src:
      local('Grift'),
      local('GRIFT'),
      local('Grift Regular'),
      url(${nexafont}) format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: 0;
    user-select: none;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  html,
  body,
  #root {
    background: transparent !important;
  }
  
  body {
    font-family: 'Grift', 'Nexa-Book', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow: hidden;
    color: #ffffff;
    
    background: transparent;
  }

  /* Force all UI text to pure white */
  body,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  span,
  label,
  small,
  strong,
  em,
  a,
  li,
  dt,
  dd,
  legend,
  button,
  input,
  select,
  textarea {
    color: #ffffff !important;
  }

  input::placeholder,
  textarea::placeholder {
    color: rgba(255, 255, 255, 0.85) !important;
  }

  /* Force all SVG icons to pure white */
  svg,
  svg *,
  i[class*='icon'],
  [class*='icon'] svg {
    color: #ffffff !important;
    fill: #ffffff !important;
    stroke: #ffffff !important;
  }

  :root {
    --glass-panel-bg: linear-gradient(140deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.08) 45%, rgba(255, 255, 255, 0.03) 100%);
    --glass-panel-border: 1px solid rgba(255, 255, 255, 0.42);
  }

  button {
    cursor: pointer;
    outline: 0;
    font-family: inherit;
  }

  input, select, textarea {
    font-family: inherit;
  }

  p {
    margin: 0;
    padding: 0;
    font-family: 'Grift', 'Nexa-Book', sans-serif;
  }

  ::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }

  ::-webkit-scrollbar-track,
  ::-webkit-scrollbar-thumb {
    display: none;
  }
`;
