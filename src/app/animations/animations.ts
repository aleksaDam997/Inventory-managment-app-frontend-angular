import {
  trigger,
  transition,
  style,
  query,
  group,
  animate,
} from '@angular/animations';

// Garantovana fade animacija
export const fadeAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    // Stil za ENTER komponentu
    query(':enter', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0,
      })
    ], { optional: true }),
    
    // Stil za LEAVE komponentu
    query(':leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 1,
      })
    ], { optional: true }),
    
    // Animacija
    group([
      query(':leave', [
        animate('250ms ease-out', style({ opacity: 0 }))
      ], { optional: true }),
      
      query(':enter', [
        animate('400ms 100ms ease-in', style({ opacity: 1 }))
      ], { optional: true })
    ])
  ])
]);

// Fade + Slide animacija (smooth)
export const fadeSlideAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0,
        transform: 'translateY(20px)'
      })
    ], { optional: true }),
    
    query(':leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      })
    ], { optional: true }),
    
    group([
      query(':leave', [
        animate('250ms ease-out', style({ 
          opacity: 0,
          transform: 'translateY(-20px)'
        }))
      ], { optional: true }),
      
      query(':enter', [
        animate('400ms 50ms cubic-bezier(0.35, 0, 0.25, 1)', style({ 
          opacity: 1,
          transform: 'translateY(0)'
        }))
      ], { optional: true })
    ])
  ])
]);

// Scale + Fade (moderniji)
export const fadeScaleAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0,
        transform: 'scale(0.95)'
      })
    ], { optional: true }),
    
    query(':leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      })
    ], { optional: true }),
    
    group([
      query(':leave', [
        animate('200ms ease-in', style({ 
          opacity: 0,
          transform: 'scale(1.05)'
        }))
      ], { optional: true }),
      
      query(':enter', [
        animate('400ms 80ms cubic-bezier(0.35, 0, 0.25, 1)', style({ 
          opacity: 1,
          transform: 'scale(1)'
        }))
      ], { optional: true })
    ])
  ])
]);