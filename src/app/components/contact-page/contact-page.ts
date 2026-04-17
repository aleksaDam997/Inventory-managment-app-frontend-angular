import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactEmailService } from '../../services/contact.email.service';
import { NotificationService } from '../../services/notification.service';
import { SendContactEmailRequest } from '../../models/request.model';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.css'
})
export class ContactPage {

  contactForm: FormGroup;
    showSuccess = false;

    constructor(private fb: FormBuilder, private contactEmailService: ContactEmailService, private notify: NotificationService) {
      this.contactForm = this.fb.group({
        name: ['', Validators.required],
        contact: ['', [Validators.required]],
        subject: ['', Validators.required],
        content: ['', Validators.required]
      });
    }

    onSubmit() {
      if (this.contactForm.valid) {
        
        // Ovde dodaj logiku za slanje emaila (EmailJS, HTTP request, etc.)
        
        this.showSuccess = true;

        const contactData: SendContactEmailRequest = {
          sender: this.contactForm.value.name,
          contact: this.contactForm.value.contact,
          subject: this.contactForm.value.subject,
          content: this.contactForm.value.content
        };

        this.contactForm.reset();


        
        this.contactEmailService.sendContactEmail(contactData).subscribe({
          next: (response) => {
            this.notify.success(response.message);
          },
          error: (error) => {
            console.error('Greška prilikom slanja emaila:', error);
            this.notify.error('Failed to send email.');
            
          }
        });
      }
    }

    get name() { return this.contactForm.get('name'); }
    get contact() { return this.contactForm.get('contact'); }
    get subject() { return this.contactForm.get('subject'); }
    get content() { return this.contactForm.get('message'); }
}
