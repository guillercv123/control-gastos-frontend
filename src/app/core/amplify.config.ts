import {environment} from '../../environments/environment';
import { Amplify } from 'aws-amplify';

export const configurarAmplify = (): void => {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: environment.cognito.userPoolId,
        userPoolClientId: environment.cognito.userPoolClientId,
      },
    },
  });
};
