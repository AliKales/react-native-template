import { Platform } from 'react-native';

export const APP_CONFIG = {
  name: 'Hablo Talk',
};

export const COLORS = {
  primary: '#3ad1ff',
  light: {
    background: '#ffffff',
    text: '#1a1a1a',
    textSecondary: '#666666',
    icon: '#1a1a1a',
    border: '#cccccc',
    inputBackground: '#f9f9f9',
    placeholder: '#aaaaaa',
  },
  dark: {
    background: '#121212',
    text: '#ffffff',
    textSecondary: '#aaaaaa',
    icon: '#ffffff',
    border: '#333333',
    inputBackground: '#1e1e1e',
    placeholder: '#888888',
  }
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
