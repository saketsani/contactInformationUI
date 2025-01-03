import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Contact } from '../../models/contact-model';
import { ContactServiceService } from '../../services/contact-service.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contacts-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contacts-list.component.html',
  styleUrl: './contacts-list.component.css'
})
export class ContactsListComponent implements OnInit {

  @Input() contacts: Contact[] = [];
  @Output() editContact = new EventEmitter<Contact>();
  @Output() deleteContact = new EventEmitter<any>();
  
  constructor() {}

  ngOnInit(): void {
   
  }
  onEdit(contact: Contact): void {
    this.editContact.emit(contact);
  }

  onDelete(id: any): void {
    this.deleteContact.emit(id);
  }

}
