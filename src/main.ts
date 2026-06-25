import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { configurarAmplify } from './app/core/amplify.config';

configurarAmplify();
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
