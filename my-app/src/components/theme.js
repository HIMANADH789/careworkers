// theme.js
import { deepFreeze } from "grommet/utils";

export const theme = deepFreeze({
  global: {
    font: {
      family: 'Inter, sans-serif',
      size: '14px',
      height: '20px',
    },
    colors: {
      // Primary brand color
      brand: '#008080', // A calming Teal
      // Accent colors for background and highlights
      'accent-1': '#f8f6f0', // A soft, creamy background
      'accent-2': '#03a9f4', // A light blue
      'accent-3': '#e91e63', // A vibrant pink
      'accent-4': '#f5a434', // A warm orange
      
      // Feedback status colors
      'status-critical': '#f44336', // Red
      'status-warning': '#ffc107', // Yellow
      'status-ok': '#4caf50', // Green
      
      // Neutral colors for text and borders
      text: {
        dark: '#333333',
        light: '#f8f8f8',
      },
      border: {
        dark: '#d3d3d3',
        light: '#e0e0e0',
      },
    },
    breakpoints: {
      small: {
        value: 768,
        borderSize: {
          xsmall: '1px',
          small: '2px',
          medium: '3px',
          large: '4px',
          xlarge: '5px',
        },
      },
    },
  },
  card: {
    container: {
      round: 'medium',
      elevation: 'small',
      background: 'white',
    },
  },
  button: {
    border: {
      radius: '8px',
    },
  },
});
