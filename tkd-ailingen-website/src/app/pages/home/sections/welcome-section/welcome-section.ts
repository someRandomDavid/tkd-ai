import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material.module';

/**
 * Welcome section component displaying the history of Taekwondo Ailingen
 * Founded by Giuseppe Pistillo in April 1989
 */
@Component({
  selector: 'app-welcome-section',
  imports: [CommonModule, MaterialModule],
  templateUrl: './welcome-section.html',
  styleUrl: './welcome-section.scss',
})
export class WelcomeSection {}
