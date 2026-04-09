import { Component } from '@angular/core';

@Component({
  selector: 'app-logo',
  template: `
    <svg class="app-logo__icon" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#1652F0" />
      <path d="M10 22V10l6 8 6-8v12" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
    <span class="app-logo__text">Erebor.</span>
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      gap: 10px;
    }

    .app-logo__icon {
      width: var(--logo-size, 28px);
      height: var(--logo-size, 28px);
      flex-shrink: 0;
    }

    .app-logo__text {
      font-size: var(--logo-font-size, 18px);
      font-weight: 800;
      color: var(--logo-color, #1a1f36);
      letter-spacing: -0.3px;
      white-space: nowrap;
      display: var(--logo-text-display, inline);
    }
  `],
})
export class AppLogo {}
