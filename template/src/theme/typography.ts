import {responsiveFontSize} from 'react-native-responsive-dimensions';

export const Fonts = {
  ['font_name']: {
    100: 'font_name-hairline',
    200: 'font_name-thin',
    300: 'font_name-light',
    400: 'font_name-normal',
    500: 'font_name-medium',
    600: 'font_name-semibold',
    700: 'font_name-bold',
    800: 'font_name-extrabold',
    900: 'font_name-black',
    950: 'font_name-extrablack',
  },
} as const;

export const FontSize = {
  xs: responsiveFontSize(1),
  sm: responsiveFontSize(2),
  md: responsiveFontSize(2.5),
  lg: responsiveFontSize(3),
  xl: responsiveFontSize(4),
} as const;
