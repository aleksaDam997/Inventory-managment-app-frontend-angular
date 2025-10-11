import {
  trigger,
  transition,
  style,
  query,
  group,
  animate,
} from '@angular/animations';

// Smooth fade animacija
export const fadeAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    // Postavi stilove
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      })
    ], { optional: true }),
    
    // Postavi početni stil za :enter
    query(':enter', [
      style({ opacity: 0 })
    ], { optional: true }),
    
    // Animiraj obje komponente istovremeno
    group([
      query(':leave', [
        animate('200ms ease-out', style({ opacity: 0 }))
      ], { optional: true }),
      
      query(':enter', [
        animate('300ms ease-in', style({ opacity: 1 }))
      ], { optional: true })
    ])
  ])
]);

// Fade + Slide (smooth sa malim pomjeranjem)
export const fadeSlideAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      })
    ], { optional: true }),
    
    query(':enter', [
      style({ 
        opacity: 0,
        transform: 'translateX(15px)'
      })
    ], { optional: true }),
    
    group([
      query(':leave', [
        animate('250ms ease-out', style({ 
          opacity: 0,
          transform: 'translateX(-15px)'
        }))
      ], { optional: true }),
      
      query(':enter', [
        animate('350ms ease-out', style({ 
          opacity: 1,
          transform: 'translateX(0)'
        }))
      ], { optional: true })
    ])
  ])
]);

// Scale fade (zoom efekat)
export const fadeScaleAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      })
    ], { optional: true }),
    
    query(':enter', [
      style({ 
        opacity: 0,
        transform: 'scale(0.96)'
      })
    ], { optional: true }),
    
    group([
      query(':leave', [
        animate('200ms ease-out', style({ 
          opacity: 0
        }))
      ], { optional: true }),
      
      query(':enter', [
        animate('350ms ease-out', style({ 
          opacity: 1,
          transform: 'scale(1)'
        }))
      ], { optional: true })
    ])
  ])
]);