import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { TOKEN } from '../../../../core/helper/constants';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NzIconModule,
    NzMenuModule,
    NzLayoutModule,
    NzSpaceModule,
    NzTypographyModule,
    NzFlexModule,
    RouterOutlet,
    RouterModule,
    CommonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css', '../../../../../styles.css'],
})
export class DashboardComponent implements OnInit {
  isCollapsed = false;
  constructor(private router: Router) {}
  ngOnInit() {}

  logout() {
    localStorage.removeItem(TOKEN);
    this.router.navigate(['/login']);
  }
}
