import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error' | 'ghost' | 'link' | 'outline';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [ngClass]="[
        'btn',
        variant ? 'btn-' + variant : '',
        size ? 'btn-' + size : '',
        block ? 'btn-block' : '',
        loading ? 'loading' : ''
      ]"
      (click)="onClick($event)"
    >
      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant?: ButtonVariant;
  @Input() size?: ButtonSize;
  @Input() block = false;
  @Input() disabled = false;
  @Input() loading = false;

  @Output() buttonClick = new EventEmitter<MouseEvent>();

  onClick(event: MouseEvent): void {
    this.buttonClick.emit(event);
  }
}
