import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Contact } from '../../models/contact-model';
import { ContactServiceService } from '../../services/contact-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css'
})
export class ContactFormComponent {
  showForm: boolean = false; 
  contactForm: FormGroup;
  @Input() set contact(data: Contact | null) {
    if (data) {
      this.showForm = true;
      this.contactForm.patchValue(data);
    } else {
      this.contactForm.reset();
    }
  }
  @Output() contactUpdated = new EventEmitter<Contact>();
  @Output() contactAdded = new EventEmitter<Contact>();
  
  constructor(private fb: FormBuilder, private contactsService: ContactServiceService) {
    this.contactForm = this.fb.group({
      id: [null],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }
  toggleForm(): void {
    this.showForm = !this.showForm;
    if (this.showForm) {
      this.contactForm.reset();
    }
  }
  ngOnInit(): void {}

  onSubmit(): void {
    if (this.contactForm.valid) {
      const contact = this.contactForm.value;
      
      if (contact.id) {
        this.contactsService.updateContact(contact).subscribe(
          (updatedContact) => {
            this.contactUpdated.emit(updatedContact);
            console.log('Contact updated successfully:', updatedContact);
          },
          (error) => {
            console.error('Error updating contact:', error);
          });
          
      } 
      else {
        this.contactsService.addContact(contact).subscribe(
          (createdContact) => {
            this.contactAdded.emit(createdContact);
            console.log('Contact added successfully:', createdContact);
          },
          (error) => {
            console.error('Error adding contact:', error);
          }
        );
      
      }
      this.toggleForm();
      this.contactForm.reset();
    }
  }
}
