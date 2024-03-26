import { Component, EventEmitter, Output } from '@angular/core';
import { SessionService } from '../../../session.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'dgta-search-catalogue',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './dgta-search-catalogue.component.html',
  styleUrl: './dgta-search-catalogue.component.scss'
})
export class DgtaSearchCatalogueComponent {
  @Output() getCataloguesE = new EventEmitter()

  faSearch = faSearch

  constructor(private sessionService: SessionService) {

  }

  onSearch(e: any) {
    this.sessionService.terms["title"] = encodeURI("*" + e.target.value + "*")
    
    this.getCataloguesE.emit()
  }
}
