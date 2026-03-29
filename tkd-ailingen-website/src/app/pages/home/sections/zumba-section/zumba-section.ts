import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material.module';

/**
 * Dedicated Zumba program section with detailed information
 */
@Component({
  selector: 'app-zumba-section',
  imports: [CommonModule, MaterialModule],
  templateUrl: './zumba-section.html',
  styleUrl: './zumba-section.scss',
})
export class ZumbaSection {}
