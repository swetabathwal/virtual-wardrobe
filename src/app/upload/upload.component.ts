import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-upload',
  standalone: false,
  
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent implements OnInit {
  uploadedImages: string[] = [];
  images: File[] = [];

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog
  ) {}

  ngOnInit():void{
    this.iconRegistry.addSvgIcon(
      'upload',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/upload-icon.svg')
    );
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files) {
      this.processFiles(files);
    }
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;  // Type assertion to HTMLInputElement
    if (input && input.files) {// Check if the files property exists
      this.images = Array.from(input.files);  // Store selected files
    }
  }

  processFiles(files: FileList): void {
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        this.uploadedImages.push(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  }

  removeImage(index: number): void {
    this.uploadedImages.splice(index, 1);
  }

  openImageModal(){
    const dialogRef = this.dialog.open(ImageSelectionModal, {
      width: '80%',
      data: { images: this.images }
    });
  }


}

@Component({
  selector: 'app-image-selection-modal',
  template: `
    <h2 mat-dialog-title>Choose Your Style</h2>
    <div mat-dialog-content>
      <div class="image-container">
        <img [src]="data.images[currentIndex].src" alt="Image Preview" />
      </div>

      <div class="dress-types">
        <div *ngFor="let type of data.images[currentIndex].types" class="pill-option">
          <button mat-button (click)="onDressTypeSelect(type)">{{ type }}</button>
        </div>
      </div>

      <div class="navigation">
        <button mat-icon-button (click)="onPrevious()" [disabled]="currentIndex === 0">
          <!-- <mat-icon>arrow_back</mat-icon> -->
        </button>
        <button mat-icon-button (click)="onNext()" [disabled]="currentIndex === data.images.length - 1">
          <!-- <mat-icon>arrow_forward</mat-icon> -->
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./upload.component.css']
})
export class ImageSelectionModal {
  currentIndex = 0;
  dressTypes = ['Casual', 'Formal', 'Sportswear']; 

  constructor(
    public dialogRef: MatDialogRef<ImageSelectionModal>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  get imageUrl(): string {
    const file = this.data.images[this.currentIndex];
    return URL.createObjectURL(file); // Create URL for file object to preview image
  }

  onNext(): void {
    if (this.currentIndex < this.data.images.length - 1) {
      this.currentIndex++;
    }
  }

  onPrevious(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  onDressTypeSelect(dressType: string): void {
    // Handle dress type selection logic
    console.log('Selected dress type:', dressType);
  }

  close(): void {
    this.dialogRef.close();
  }
}
