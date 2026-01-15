import { NgModule } from '@angular/core';

// Material Components
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

const MATERIAL_MODULES = [
  MatToolbarModule,
  MatSidenavModule,
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
  MatRippleModule,
  MatFormFieldModule,
  MatSelectModule,
  MatInputModule,
];

/**
 * Centralized Material module for tree-shaking optimization.
 * Import this module wherever Material components are needed.
 * 
 * Per constitution principle II (Minimal Dependencies):
 * - Only imports Material modules actually used in the application
 * - Enables tree-shaking to reduce bundle size
 * - All Material imports centralized for easy audit
 */
@NgModule({
  imports: MATERIAL_MODULES,
  exports: MATERIAL_MODULES,
})
export class MaterialModule {}
