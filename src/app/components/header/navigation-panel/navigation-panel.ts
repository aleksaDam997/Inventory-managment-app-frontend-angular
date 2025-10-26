import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from '../../../app.routes';
import { AuthService } from '../../../services/auth.service';
import { UserRole } from '../../../models/user.model';

@Component({
  selector: 'app-navigation-panel',
  standalone: true,
  imports: [CommonModule ,RouterModule],
  templateUrl: './navigation-panel.html',
  styleUrl: './navigation-panel.css'
})
export class NavigationPanel implements OnInit {

  @ViewChild('hamburger', { static: true }) hamburger!: ElementRef;

  protected title = 'IM Navigation Panel';

  routes = routes.find(r => r.path === 'app')?.children;


  sidebarOpen = false;
  isSmallScreen = false;
  isBrowser: boolean;
  sidebarCollapsed = false;

  role: UserRole;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private authService: AuthService) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.isSmallScreen = window.innerWidth < 768;
    }

    this.role = this.authService.getUserRole() as UserRole;
  }

@HostListener('window:resize', [])
onResize() {
  if (!this.isBrowser) return;

  this.isSmallScreen = window.innerWidth < 768;

  if (this.isSmallScreen) {
    this.sidebarCollapsed = true;
    this.sidebarOpen = false; // Ako želiš da se sidebar potpuno sakrije
  } else {
    this.sidebarOpen = true;
    // Dozvoli korisniku da sam upravlja širinom na većim ekranima
  }
}

sidebarExpanded = false;

toggleSidebar() {
  this.sidebarExpanded = !this.sidebarExpanded;
}
  ngOnInit() {
    if (this.isBrowser) {
      this.onResize();
    }
  }

  toggleSidebarCollapse() {
  this.sidebarCollapsed = !this.sidebarCollapsed;
}
}
