import {ReactotronReactNative} from 'reactotron-react-native';

export declare module 'axios' {
  interface AxiosRequestConfig {
    withAuth?: boolean;
    accessToken?: string;
  }
}

/**
 * @memberof Console
 * @namespace tron
 */
declare global {
  interface Console {
    /**
     * ReactotronReactNative instance, only available in debug builds
     */
    tron?: ReactotronReactNative;
  }
}
