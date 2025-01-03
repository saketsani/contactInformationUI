import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContactsListComponent } from './components/contacts-list/contacts-list.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { Contact } from './models/contact-model';
import { ContactServiceService } from './services/contact-service.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ContactsListComponent,ContactFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'contactInformationUI';
  contacts: Contact[] = [];
  selectedContact: Contact | null = null;

  constructor(private contactService: ContactServiceService) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.contactService.getContacts().subscribe(
      (data: Contact[]) => {
        this.contacts = data;
      },
      (error: any) => {
        console.error('Error loading contacts:', error);
      }
    );
  }

  onContactAdded(newContact: Contact): void {
    this.contacts.push(newContact); // Add the new contact to the local list
    this.selectedContact = null; // Reset the selected contact
  }

  onContactUpdated(updatedContact: Contact): void {
    const index = this.contacts.findIndex((c) => c.id === updatedContact.id);
    if (index !== -1) {
      this.contacts[index] = updatedContact; // Update the existing contact in the list
    }
    this.selectedContact = null; // Reset the selected contact
  }

  onEditContact(contact: Contact): void {
    this.selectedContact = { ...contact }; // Set the selected contact for editing
  }

  onDeleteContact(contactId: number): void {
    this.contactService.deleteContact(contactId).subscribe(
      () => {
        this.contacts = this.contacts.filter((c) => c.id !== contactId); // Remove the contact from the list
      },
      (error: any) => {
        console.error('Error deleting contact:', error);
      }
    );
  }
}