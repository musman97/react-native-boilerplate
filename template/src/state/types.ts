export interface GlobalState {
  splashLoading: boolean;
  loggedIn: boolean;
  accessToken: string;

  setSplashLoading: (loading: boolean) => void;
  setLoggedIn: (loggedIn: boolean) => void;
  setAccessToken: (accessToken: string) => void;
}
