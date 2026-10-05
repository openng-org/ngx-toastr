import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'gh-counter',
  imports: [DecimalPipe],
  template: `
    <a
      class="counter"
      [href]="counterHref()"
      [attr.aria-label]="count() + counterLabel() + ' on GitHub'"
    >
      <span>{{ count() | number }}</span>
    </a>
  `,
  styles: [
    `
      .counter {
        display: inline-block;
        font-family:
          -apple-system,
          BlinkMacSystemFont,
          Segoe UI,
          Helvetica,
          Arial,
          sans-serif,
          Apple Color Emoji,
          Segoe UI Emoji;
        list-style-type: none;
        tab-size: 4 !important;
        box-sizing: border-box;
        text-decoration: none;
        position: relative;
        padding: 3px 12px;
        font-size: 12px;
        font-weight: 600;
        line-height: 20px;
        color: #24292e;
        vertical-align: middle;
        background-color: #fff;
        border: 1px solid rgba(27, 31, 35, 0.15);
        border-left: 0;
        border-top-right-radius: 6px;
        border-bottom-right-radius: 6px;
        box-shadow:
          0 1px 0 rgba(27, 31, 35, 0.04),
          inset 0 1px 0 hsla(0, 0%, 100%, 0.25);
      }
      .counter:hover {
        text-decoration: none;
        color: #0366d6;
        cursor: pointer;
      }
      .counter:focus {
        border-color: #c8e1ff;
      }
    `,
  ],
})
export class GhCounterComponent {
  readonly count = input.required<number>();
  readonly counterLabel = input.required<string>();
  readonly counterHref = input.required<string>();
}
