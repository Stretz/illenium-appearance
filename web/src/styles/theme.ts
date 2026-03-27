export const modernTheme = {
  id: 'modern-minimal',
  
  // Colors
colors: {
  primary: '#9400D3', // dark violet (rgb 148, 0, 211)
  primaryHover: '#B05AEC', // lighter violet for hover

  secondary: '#2C2C2E', // dark grey-blue for secondary components (iOS system gray)
  accent: '#9400D3', // consistent violet accent across all highlights

  background: '#1C1C1E', // iOS dark background
  surface: '#2C2C2E', // iOS dark card background
  surfaceHover: '#3A3A3C', // iOS slightly lighter hover shade

  text: {
    primary: '#9400D3', // primary text matches accent
    secondary: '#C89FF5', // softer violet for secondary text
    muted: '#A1A1AA', // soft gray for placeholder/help text
  },

  border: '#3A3A3C', // standard iOS border color
  borderHover: '#9400D3', // highlight border with accent

  success: '#32D74B', // iOS green
  error: '#FF453A', // iOS red
  warning: '#FFD60A', // iOS yellow warning
},

  
  // Spacing
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },
  
  // Typography
  typography: {
    fontFamily: "'Grift', 'Nexa-Book', Inter, -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px'
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75
    }
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  },
  
  // Border radius
  borderRadius: {
    sm: '4px',
    base: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px'
  },
  
  // Animation
  animation: {
    duration: {
      fast: '0.15s',
      normal: '0.3s',
      slow: '0.5s'
    },
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out'
    }
  }
};

export type Theme = typeof modernTheme;
