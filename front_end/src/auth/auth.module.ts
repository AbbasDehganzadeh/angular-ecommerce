import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthRoutingModule } from './/auth-routing.module';
import { SignUpComponent } from './/pages/sign-up.component';
import { LogInComponent } from './/pages/log-in.component';
import { LogOutComponent } from './/pages/log-out.component';

@NgModule({
  declarations: [SignUpComponent, LogInComponent, LogOutComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    AuthRoutingModule,
  ],
})
export class AuthModule {}
