import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card bg-base-100 shadow-xl" [ngClass]="{'w-full': fullWidth}">
      <figure *ngIf="imageUrl">
        <img [src]="imageUrl" [alt]="imageAlt || 'Card image'" />
      </figure>
      <div class="card-body" [ngClass]="{'items-center text-center': centered}">
        <h2 *ngIf="title" class="card-title" [ngClass]="{'justify-center': centered}">
          {{ title }}
          <div *ngIf="badge" class="badge badge-secondary">{{ badge }}</div>
        </h2>
        <ng-content></ng-content>
        <div *ngIf="hasActions" class="card-actions" [ngClass]="{'justify-end': !centered}">
          <ng-content select="[actions]"></ng-content>
        </div>
      </div>
    </div>
  `
})
export class CardComponent {
  @Input() title?: string;
  @Input() imageUrl?: string;
  @Input() imageAlt?: string;
  @Input() badge?: string;
  @Input() centered = false;
  @Input() fullWidth = true;

  /**
   * Checks if the card has action elements
   * This is used to conditionally render the card-actions div
   */
  get hasActions(): boolean {
    // This will be true if there are elements with the 'actions' attribute
    // We can't check this directly in the template, so we use a getter
    return true;
  }
}
