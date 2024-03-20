import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSignIn } from '@fortawesome/free-solid-svg-icons';
import { HttpService } from '../../http.service';
import { LoadingService } from '../../dgta-loading/loading.service';
import { SessionService } from '../../session.service';
import { PageEnum } from '../../interfaces/IPageNavigation';


@Component({
  selector: 'dgta-login',
  standalone: true,
  imports: [FontAwesomeModule],
  providers: [HttpService],
  templateUrl: './dgta-login.component.html',
  styleUrl: './dgta-login.component.scss'
})
export class DgtaLoginComponent {
  faSignIn = faSignIn

  dgta = "dgt@"

  email = ""
  password = ""

  constructor(private http: HttpService, 
              private loadingService: LoadingService,
              private sessionService: SessionService) { }

  editEmail(e: any) {
    this.email = e.target.value
  }

  editPassword(e: any) {
    this.password = e.target.value
  }

  logIn() {
    if (!this.email || !this.password) {
      alert("Compilare tutti i campi")
    } else if(!this.email.includes("@") || !this.email.includes(".")) {
      alert("Inserire un indirizzo email valido.")
    } else {

      let payload = {
        "emailqry": this.email.replaceAll(".","").replaceAll("@",""),
        "password": this.password
      }

      this.loadingService.isLoading = true
      this.http.login(payload).subscribe({
        next: (response: any) => {
          this.loadingService.isLoading = false
          if (response["code"] == 501) {
            alert("L'utente non è stato trovato'")
          } else if(response["code"] == 502) {
            alert("La password inserita non è corretta.")
          } else {
            alert("Accesso effettuato correttamente")
            this.sessionService.saveSession("user", response)
            console.log(response)

            this.sessionService.pageNavigation.push(PageEnum.HOME)
            this.sessionService.saveSession("pageNavigation", PageEnum.HOME)
            window.location.reload()
          }
        },
        error: (error) => {
          console.error(error)
          this.loadingService.isLoading = false
        }
      })
    }
  }
}
