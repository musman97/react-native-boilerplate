import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

export const VSpacing = {
  xs: responsiveHeight(0.5),
  sm: responsiveHeight(1),
  md: responsiveHeight(2),
  lg: responsiveHeight(4),
  xl: responsiveHeight(6),
} as const;

export const HSpacing = {
  xs: responsiveWidth(0.5),
  sm: responsiveWidth(1),
  md: responsiveWidth(2),
  lg: responsiveWidth(4),
  xl: responsiveWidth(6),
} as const;

export const vSpacing = (value = 0) => responsiveHeight(value);

export const hSpacing = (value = 0) => responsiveWidth(value);
