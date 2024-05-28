import { Component, EventEmitter, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSignIn } from '@fortawesome/free-solid-svg-icons';
import { HttpService } from '../../http.service';
import { LoadingService } from '../../dgta-loading/loading.service';
import { SessionService } from '../../session.service';
import { PageEnum } from '../../interfaces/IPageNavigation';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'dgta-register',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './dgta-register.component.html',
  styleUrl: './dgta-register.component.scss'
})
export class DgtaRegisterComponent {

  @Output() goToLoginE = new EventEmitter()


  faSignIn = faSignIn

  dgta = "dgt@"

  email = ""
  password = ""
  confirmPassword = ""
  firstName = ""
  lastName = ""

  isCompleted = false


  accepted = false

  constructor(private http: HttpService,
    private loadingService: LoadingService,
    private sessionService: SessionService) { }

  editFirstName(e: any) {
    this.firstName = e.target.value
  }

  editLastName(e: any) {
    this.firstName = e.target.value
  }
  editEmail(e: any) {
    this.email = e.target.value
  }

  editPassword(e: any) {
    this.password = e.target.value
  }

  editConfirmPassword(e: any) {
    this.confirmPassword = e.target.value
  }

  register() {
    if (!this.email || !this.password || !this.confirmPassword) {
      alert("Compilare tutti i campi")
    } else if (!this.email.includes("@") || !this.email.includes(".")) {
      alert("Inserire un indirizzo email valido.")
    } else if (this.password != this.confirmPassword) {
      alert("Le password non coincidono")
    } else if (!this.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/)) {
      alert("La password deve essere di almeno 8 caratteri e avere una lettera maiuscola, una miuscola e un carattere speciale")
    } else {

      let payload = {
        "email": this.email,
        "role": "user",
        "firstName": this.firstName,
        "lastName": this.lastName,
        "emailqry": this.email.replaceAll(".", "").replaceAll("@", ""),
        "password": this.password
      }

      this.loadingService.isLoading = true
      this.http.register(payload).subscribe({
        next: (response: any) => {
          this.loadingService.isLoading = false

          this.isCompleted = true
        },
        error: (error) => {
          console.error(error)
          this.loadingService.isLoading = false
        }
      })
    }
  }

  checkAccepts() {
    if (this.accepted) {
      this.accepted = false
    } else {
      this.accepted = true
    }
  }

  goToLogin() {
    this.goToLoginE.emit()
  }
}
