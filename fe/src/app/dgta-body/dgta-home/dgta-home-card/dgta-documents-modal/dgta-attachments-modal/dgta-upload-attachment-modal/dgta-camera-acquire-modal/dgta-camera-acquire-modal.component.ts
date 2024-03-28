import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import jsPDF from 'jspdf';

@Component({
  selector: 'dgta-camera-acquire-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dgta-camera-acquire-modal.component.html',
  styleUrl: './dgta-camera-acquire-modal.component.scss'
})
export class DgtaCameraAcquireModalComponent {

  @Output() closeCameraAcquireModalE = new EventEmitter()
  @Output() uploadAttachmentE= new EventEmitter<string>()
  canvas: any
  video: any
  context: any

  imageSrcList: any[] = []

  ngOnInit() {
    this.video = document.querySelector('video')!;
    this.canvas = document.querySelector('#canvas-camera')!;
    this.context = this.canvas.getContext('2d')!;
    var localMediaStream: any = null;

    const snapshot = () => {
      if (localMediaStream) {
        this.context.drawImage(this.video, 0, 0);
        // "image/webp" works in Chrome.
        // Other browsers will fall back to image/png.
        document.querySelector('img')!.src = this.canvas.toDataURL('application/pdf');
      }
    }

    this.video.addEventListener('click', snapshot, false);

    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          // Handle the video stream
          this.video.srcObject = stream;
        })
        .catch((error) => {
          console.error('Error accessing camera:', error);
        });
    } else {
      console.error('getUserMedia is not supported in this browser');
    }
  }

  cancel() {
    if (navigator.mediaDevices) {
      const tracks = this.video.srcObject.getTracks();

      tracks.forEach((track: any) => {
          track.stop(); // This stops the track
      });
    }

    this.closeCameraAcquireModalE.emit()
  }

  getPhoto() {
    // Set the canvas size to match the video feed
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;

    // Draw the current video frame on the canvas
    this.context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

    // Convert the canvas content to a data URL representing the captured image
    const imageDataUrl = this.canvas.toDataURL('application/pdf');

    this.imageSrcList.push(imageDataUrl)

    this.imageSrcList = JSON.parse(JSON.stringify(this.imageSrcList))
  }

  deleteImg(imageSrc: string) {
    this.imageSrcList = this.imageSrcList.filter((acquiredImageSrc) => imageSrc != acquiredImageSrc)
  }

  getImgIndex(index: number) {
    return "img" + index.toString()
  }

  zoomIn(index: number) {
    document.getElementById(this.getImgIndex(index))?.setAttribute("class", "w-100 zoom")
  }

  zoomOut(index: number) {
    document.getElementById(this.getImgIndex(index))?.setAttribute("class", "w-100")
  }

  mergeImagesToPdf(images: string[]): string {
    let pdf = new jsPDF();

    for (let pageNum = 0; pageNum < images.length; pageNum++) {
      let image = images[pageNum]

      pdf = pdf.addImage(image, 'png', 10, 10, 190, 0);

      if ( pageNum < images.length - 1) {
        pdf = pdf.addPage()
      }
    }

    return pdf.output('dataurlstring')
          
  }

  updateDocument() {
    let dataURIPdf = this.mergeImagesToPdf(this.imageSrcList).replace("filename=generated.pdf;", "")
    this.uploadAttachmentE.emit(dataURIPdf)
  }
}


