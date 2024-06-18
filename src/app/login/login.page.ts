import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConstants } from '../config/auth-constants';
import { AuthService } from './../services/auth.service';
import { StorageService } from './../services/storage.service';
import { ToastService } from './../services/toast.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  showPassword: boolean = false;
  passwordFieldType: string = 'password';

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    this.passwordFieldType = this.showPassword ? 'text' : 'password';
  }

  postData = {
    username: '',
    password: '',
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private toastService: ToastService
  ) {}

  ngOnInit() {}

  validateInputs() {
    let username = this.postData.username.trim();
    let password = this.postData.password.trim();
    return (
      this.postData.username &&
      this.postData.password &&
      username.length > 0 &&
      password.length > 0
    );
  }

  loginAction() {
    if (this.validateInputs()) {
      const body = {
        username: this.postData.username,
        password: this.postData.password,
      };
      this.authService
        .login(JSON.stringify(body))
        .then((observableResult) => {
          observableResult.subscribe(
            (res: any) => {
              if (res.status) {
                // Storing the User data.
                this.toastService.presentToast('Bienvenido!');
                this.authService.setUserData(res.result.data);
                // console.log(this.authService.getUserData());

                this.router.navigate(['tabs/tab1']);
              } else {
                this.toastService.presentToast(
                  'Usuario o contraseña incorrectos'
                );
              }
            },
            (error: any) => {
              this.toastService.presentToast(
                'Error en la red, comuníquese con un administrador.'
              );
            }
          );
        })
        .catch((error) => {
          // Manejar errores relacionados con la promesa
          console.error('Error al realizar la solicitud de login:', error);
        });
    } else {
      this.toastService.presentToast('Please enter username or password.');
    }
  }
}
