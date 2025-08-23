import { Component } from '@angular/core';
import { NavigationPanel } from '../header/navigation-panel/navigation-panel';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-panel',
  imports: [NavigationPanel, RouterOutlet],
  templateUrl: './main-panel.html',
  styleUrl: './main-panel.css'
})
export class MainPanel {

}
