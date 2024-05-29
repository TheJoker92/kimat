import { Component } from '@angular/core';
import { DgtaLoginComponent } from './dgta-login/dgta-login.component';
import { DgtaLoadingComponent } from '../dgta-loading/dgta-loading.component';
import { LoadingService } from '../dgta-loading/loading.service';
import { CommonModule } from '@angular/common';
import { SessionService } from '../session.service';
import { DgtaHomeComponent } from './dgta-home/dgta-home.component';
import { ICatalogue } from '../interfaces/ICatalogue';
import { DgtaDossierModalComponent } from './dgta-catalogue-list/dgta-dossier-modal/dgta-dossier-modal.component';
import { DgtaDocumentsModalComponent } from './dgta-home/dgta-home-card/dgta-documents-modal/dgta-documents-modal.component';
import { DgtaRegisterComponent } from './dgta-register/dgta-register.component';
import { DgtaRecoverPasswordComponent } from './dgta-recover-password/dgta-recover-password.component';

@Component({
  selector: 'dgta-body',
  standalone: true,
  imports: [CommonModule, DgtaRecoverPasswordComponent, DgtaDocumentsModalComponent, DgtaRegisterComponent, DgtaLoginComponent, DgtaLoadingComponent, DgtaHomeComponent, DgtaDossierModalComponent],
  providers: [LoadingService, SessionService],
  templateUrl: './dgta-body.component.html',
  styleUrl: './dgta-body.component.scss'
})
export class DgtaBodyComponent {
  constructor(public loadingService: LoadingService,
              public sessionService: SessionService) {

  }

  isLoginMode = true
  isRegistrationMode = false
  isRecoverPassword = false

  isOpenCatalogue = true
  isOpenDossier = false
  isOpenDocuments = false

  selectedCatalogue: any
  selectedDossier: any

  closeCatalogue(catalogue: ICatalogue) {
    this.selectedCatalogue = catalogue
  }

  fromDocumenToDossier() {
    // this.selectedDocument = undefined

    this.isOpenCatalogue = false
    this.isOpenDossier = true
    this.isOpenDocuments = false
  }

  fromCatalogeToDossier(catalogue: any) {
    this.selectedCatalogue = catalogue

    this.isOpenCatalogue = false
    this.isOpenDossier = true
    this.isOpenDocuments = false
  }

  fromDossierToCatalogue() {
    this.selectedDossier = undefined

    this.isOpenCatalogue = true
    this.isOpenDossier = false
    this.isOpenDocuments = false
  }

  fromDossierToDocument(dossier: any) {
    this.selectedDossier = dossier

    this.isOpenCatalogue = false
    this.isOpenDossier = false
    this.isOpenDocuments = true
  }

  
  goToRegistration() {
    this.isLoginMode = false
    this.isRegistrationMode = true
    this.isRecoverPassword = false
  }

  goToLogIn() {
    this.isLoginMode = true
    this.isRegistrationMode = false
    this.isRecoverPassword = false
  }

  goToRecoverPassword() {
    this.isLoginMode = false
    this.isRegistrationMode = false
    this.isRecoverPassword = true
  }
}
