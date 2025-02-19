import { Routes } from '@angular/router';
import {TimerComponent} from './timer/timer.component';

export const routes: Routes = [
  {
    path: 'pomodoro',
    component: TimerComponent
  },
  { path: '', redirectTo:   '/pomodoro', pathMatch: 'full' }
];
