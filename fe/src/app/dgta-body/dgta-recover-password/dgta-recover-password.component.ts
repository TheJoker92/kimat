import { Component, EventEmitter, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSignIn } from '@fortawesome/free-solid-svg-icons';
import { HttpService } from '../../http.service';
import { LoadingService } from '../../dgta-loading/loading.service';
import { SessionService } from '../../session.service';
import { PageEnum } from '../../interfaces/IPageNavigation';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'dgta-recover-password',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './dgta-recover-password.component.html',
  styleUrl: './dgta-recover-password.component.scss'
})
export class DgtaRecoverPasswordComponent {
  @Output() goToLoginE = new EventEmitter()

  step = 1

  faSignIn = faSignIn

  dgta = "dgt@"

  email = ""
  password = ""
  confirmPassword = ""
  token = ""

  saveSession = false

  constructor(private http: HttpService,
    private loadingService: LoadingService,
    private sessionService: SessionService) { }

  editEmail(e: any) {
    this.email = e.target.value
  }

  editToken(e: any) {
    this.token = e.target.value
  }

  editPassword(e: any) {
    this.password = e.target.value
  }

  editConfirmPassword(e: any) {
    this.confirmPassword = e.target.value
  }



  recoverPass() {
    if (!this.email) {
      alert("Compilare tutti i campi")
    } else if (!this.email.includes("@") || !this.email.includes(".")) {
      alert("Inserire un indirizzo email valido.")
    } else {

      let payload = {
        "email": this.email,
      }

      this.loadingService.isLoading = true
      this.http.recoverPass(payload).subscribe({
        next: (response: any) => {
          this.step = 2
          this.loadingService.isLoading = false

        },
        error: (error) => {
          console.error(error)
          this.loadingService.isLoading = false
        }
      })
    }
  }

  confirmToken() {
    if (!this.token) {
      alert("Compilare tutti i campi")
    }
    else {

      let payload = {
        "email": this.email,
        "token": this.token,
      }

      this.loadingService.isLoading = true
      this.http.sendTokenRecoverPass(payload).subscribe({
        next: (response: any) => {
          this.step = 3
        },
        error: (error) => {
          console.error(error)
          this.loadingService.isLoading = false
        }
      })
    }

  }

  goToLogin() {
    this.goToLoginE.emit()
  }
}
