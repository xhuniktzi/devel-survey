import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-clipboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clipboard.component.html',
  styleUrl: './clipboard.component.css'
})
export class ClipboardComponent {
  @Input() textToCopy: string = ''; 
  copied = false;

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.textToCopy).then(() => {
      this.copied = true;
      setTimeout(() => (this.copied = false), 2000); 
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  }
}
