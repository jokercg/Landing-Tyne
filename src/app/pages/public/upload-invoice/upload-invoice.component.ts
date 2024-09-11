import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule, MatTooltip } from '@angular/material/tooltip'; 
import { Directive, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-upload-invoice',
  standalone: true,
  templateUrl: './upload-invoice.component.html',
  styleUrls: ['./upload-invoice.component.scss'],
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule, 
  ],
})
export class UploadInvoiceComponent implements OnInit {
  selectedFile: File | null = null;

  constructor() {}

  ngOnInit() {}
}


@Directive({
  selector: '[appTooltipTouch]'
})
export class TooltipTouchDirective {
  constructor(private tooltip: MatTooltip, private elementRef: ElementRef) {}


  @HostListener('touchstart', ['$event'])
  onTouchStart(event: Event): void {
    this.tooltip.show();
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: Event): void {
    this.tooltip.hide();
  }
}
