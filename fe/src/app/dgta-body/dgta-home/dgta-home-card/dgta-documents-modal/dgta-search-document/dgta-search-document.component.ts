import { Component, EventEmitter, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { SessionService } from '../../../../../session.service';

@Component({
  selector: 'dgta-search-document',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './dgta-search-document.component.html',
  styleUrl: './dgta-search-document.component.scss'
})
export class DgtaSearchDocumentComponent {
  @Output() getDocumentsE = new EventEmitter()
  @Output() hideTopicsE = new EventEmitter()

  faSearch = faSearch

  constructor(private sessionService: SessionService) {

  }

  onSearch(e: any) {
    // this.sessionService.terms["name"] = "*" + e.target.value + "*"
    
    this.getDocumentsE.emit("*" + e.target.value + "*")
    this.hideTopicsE.emit()
  }
}
