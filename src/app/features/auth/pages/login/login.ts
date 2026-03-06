import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import LoginForm from '../../components/login-form/login-form';

@Component({
  selector: 'login',
  templateUrl: './login.html',
  imports: [NgOptimizedImage, LoginForm],
})
export default class Login {}
