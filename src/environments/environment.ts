// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase  : {
    apiKey           : 'AIzaSyDqrM7BLiLm7zPAEEUSjB2935F--2lb9E8',
    authDomain       : 'slack-training.firebaseapp.com',
    databaseURL      : 'https://slack-training.firebaseio.com',
    projectId        : 'slack-training',
    storageBucket    : 'slack-training.appspot.com',
    messagingSenderId: '846473280037',
    appId            : '1:846473280037:web:0514df1d0d623c29'
  }
};
