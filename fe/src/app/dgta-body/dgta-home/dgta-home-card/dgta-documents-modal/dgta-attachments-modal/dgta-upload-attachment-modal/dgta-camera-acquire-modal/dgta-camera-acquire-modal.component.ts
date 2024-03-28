import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'dgta-camera-acquire-modal',
  standalone: true,
  imports: [],
  templateUrl: './dgta-camera-acquire-modal.component.html',
  styleUrl: './dgta-camera-acquire-modal.component.scss'
})
export class DgtaCameraAcquireModalComponent {

  @Output() closeCameraAcquireModalE = new EventEmitter()
  @Output() uploadAttachmentE = new EventEmitter()
  canvas: any
  video: any
  context: any

  imageSrcList: any[] = []

  ngOnInit() {
    this.video = document.querySelector('video')!;
    this.canvas = document.querySelector('canvas')!;
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

  updateDocument() {

  }
}


