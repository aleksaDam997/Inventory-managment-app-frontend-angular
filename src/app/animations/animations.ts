import {
  trigger,
  transition,
  style,
  query,
  group,
  animate,
  animateChild,
} from '@angular/animations';

// Crossfade animacija (overlap)
export const fadeAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
      })
    ], { optional: true }),
    
    query(':enter', [
      style({ opacity: 0 })
    ], { optional: true }),
    
    query(':leave', animateChild(), { optional: true }),
    
    group([
      query(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ], { optional: true }),
      
      query(':enter', [
        animate('400ms ease-in', style({ opacity: 1 }))
      ], { optional: true }),
    ]),
    
    query(':enter', animateChild(), { optional: true }),
  ])
]);

// Slide fade
export const fadeSlideAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
      })
    ], { optional: true }),
    
    query(':enter', [
      style({ 
        opacity: 0,
        transform: 'translateX(15px)'
      })
    ], { optional: true }),
    
    query(':leave', animateChild(), { optional: true }),
    
    group([
      query(':leave', [
        animate('400ms ease-out', style({ 
          opacity: 0,
          transform: 'translateX(-15px)'
        }))
      ], { optional: true }),
      
      query(':enter', [
        animate('500ms ease-out', style({ 
          opacity: 1,
          transform: 'translateX(0)'
        }))
      ], { optional: true }),
    ]),
    
    query(':enter', animateChild(), { optional: true }),
  ])
]);

// Scale fade
export const fadeScaleAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
      })
    ], { optional: true }),
    
    query(':enter', [
      style({ 
        opacity: 0,
        transform: 'scale(0.96)'
      })
    ], { optional: true }),
    
    query(':leave', animateChild(), { optional: true }),
    
    group([
      query(':leave', [
        animate('250ms ease-out', style({ opacity: 0 }))
      ], { optional: true }),
      
      query(':enter', [
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', style({ 
          opacity: 1,
          transform: 'scale(1)'
        }))
      ], { optional: true }),
    ]),
    
    query(':enter', animateChild(), { optional: true }),
  ])
]);