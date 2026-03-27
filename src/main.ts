import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from '../src/app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { App } from './app/app';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes, withHashLocation()),  
    provideHttpClient()
  ]
});