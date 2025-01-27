import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('slideAnimation', [
      // state(
      //   'login',
      //   style({
      //     transform: 'translateX(0)',
      //   })
      // ),
      // state(
      //   'signup',
      //   style({
      //     transform: 'translateX(100%)',
      //   })
      // ),
      transition('login <=> signup', [animate('0.5s ease-in-out')]),
    ]),
  ],
})
export class HomeComponent {
  isLogin = true; // Determines whether it's login or sign-up form
  authForm: FormGroup;
  animating = false; // Prevents animation overlap

  constructor(private fb: FormBuilder, private router : Router) {
    this.authForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      firstName: [''], // For sign-up
      lastName: [''], // For sign-up
      phoneNumber: [''], // For sign-up
    });
  }

  toggleAuthMode() {
    this.isLogin = !this.isLogin;
    if (this.animating) return; // Prevent toggling during animation

    this.authForm.reset(); // Clear form data when switching
    this.updateFormValidators();
  }

  updateFormValidators() {
    if (!this.isLogin) {
      // Adding validators for sign-up
      this.authForm.get('firstName')?.setValidators(Validators.required);
      this.authForm.get('lastName')?.setValidators(Validators.required);
      this.authForm.get('phoneNumber')?.setValidators([
        Validators.required,
        Validators.pattern('^[0-9]{10}$'),
      ]);
    } else {
      // Clear sign-up specific validators
      this.authForm.get('firstName')?.clearValidators();
      this.authForm.get('lastName')?.clearValidators();
      this.authForm.get('phoneNumber')?.clearValidators();
    }
    this.authForm.updateValueAndValidity(); // Apply changes
  }

  onSubmit() {
    this.router.navigate(['/app']);
    console.log("submt")
    if (this.authForm.valid) {
      console.log(this.isLogin ? 'Logging in...' : 'Signing up...', this.authForm.value);

      if (!this.isLogin) {
        // Simulate successful sign-up
        setTimeout(() => {
          this.toggleToLoginAfterSubmit(); // Switch to login form after sign-up
        }, 500); // Mock server delay
      }
    }
  }

  toggleToLoginAfterSubmit() {
    this.animating = true; // Block toggles during animation
    this.isLogin = true; // Switch to login mode
    setTimeout(() => {
      this.animating = false; // Allow toggles after animation completes
    }, 500); // Match animation duration
  }
}
