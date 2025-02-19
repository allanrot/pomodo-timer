import { Component, OnInit } from '@angular/core';
import {
  EMPTY,
  interval,
  map,
  merge,
  repeat,
  scan,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  takeWhile,
  tap,
} from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-timer',
  imports: [DatePipe],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss',
})
export class TimerComponent implements OnInit {
  counter: number = 0;
  startValue: number = 20 * 60 * 1000;
  private startClick$ = new Subject<boolean>();
  private pauseBtn$ = new Subject<boolean>();
  private stopClick$ = new Subject<void>();
  private timerCompleted$ = new Subject<void>();

  ngOnInit(): void {
    this.setup();
  }

  protected start() {
    this.startClick$.next(true);
  }

  protected pause() {
    this.pauseBtn$.next(true);
  }

  protected stop() {
    this.stopClick$.next();
  }

  private setup() {
    merge(
      this.startClick$.pipe(map(() => true)),
      this.pauseBtn$.pipe(map(() => false)),
    )
      .pipe(
        switchMap((val) => (val ? interval(1000) : EMPTY)),
        scan((acc: number) => {
          const newValue = acc - 1000;

          if (newValue <= 0) {
            console.log('O timer acabou! ✅');
            this.timerCompleted$.next();
          }

          return newValue;
        }, this.startValue),
        takeWhile((val) => val >= 0),
        startWith(this.startValue),
        takeUntil(
          this.stopClick$.pipe(
            tap(() => console.log('O timer foi parado manualmente! ❌')),
          ),
        ),
        repeat(),
      )
      .subscribe((val) => (this.counter = val));
  }
}
