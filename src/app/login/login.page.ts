import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { firebaseConfig } from '../firebase.credentials';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loading;
  mensaje : string;
  signInUrl : string;
  secureToken : string;
  correo : string;
  clave : string;

  constructor(
      private router : Router,
      private httpClient : HttpClient,
      private loadingController : LoadingController,
      private storage : Storage
  ) { }

  ngOnInit() {
    this.mensaje = 'Ingrese su correo y clave';
    this.signInUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + firebaseConfig.apiKey;
    this.storage.set('pruebaAppToken', '');
  }

  login(){    
    console.log('Iniciando login normal.' + '['+ Date.now() + ']');
    console.log('Verificando inputs.' + '['+ Date.now() + ']');
    let itsOk = this.verify_inputs();
    if(itsOk){
      let payload : any = {"email":this.correo, "password":this.clave, "returnSecureToken":true};
      this.send_request_to_api(payload);
    }else{
      console.log('Inputs invalidos.' + '['+ Date.now() + ']');
    }
  }
  login_Admin(){
    console.log('Iniciando login rapido, perfil Admin.' + '['+ Date.now() + ']');
    let payload : any = {"email":"admin@admin.com", "password":"111111", "returnSecureToken":true};
    this.send_request_to_api(payload);
  }
  login_Invitado(){
    console.log('Iniciando login rapido, perfil Invitado.' + '['+ Date.now() + ']');
    let payload : any = {"email":"invitado@invitado.com", "password":"222222", "returnSecureToken":true};
    this.send_request_to_api(payload);
  }
  login_Usuario(){
    console.log('Iniciando login rapido, perfil Usuario.' + '['+ Date.now() + ']');
    let payload : any = {"email":"usuario@usuario.com", "password":"333333", "returnSecureToken":true};
    this.send_request_to_api(payload);
  }
  login_Anonimo(){
    console.log('Iniciando login rapido, perfil Anonimo.' + '['+ Date.now() + ']');
    let payload : any = {"email":"anonimo@anonimo.com", "password":"444444", "returnSecureToken":true};
    this.send_request_to_api(payload);
  }
  login_Tester(){
    console.log('Iniciando login rapido, perfil Tester.' + '['+ Date.now() + ']');
    let payload : any = {"email":"tester@tester.com", "password":"555555", "returnSecureToken":true};
    this.send_request_to_api(payload);  
  }
  async send_request_to_api(payload : any){
    console.log('Preparando peticion.' + '['+ Date.now() + ']');    
    this.httpClient.post(
      this.signInUrl,
      payload)
        .toPromise()
        .then((response) => {this.handle_succesfull_request(response)},
        (reason) => {this.handle_error_on_request(reason)});
    console.log('Peticion enviada.' + '['+ Date.now() + ']');     
    this.present_autentificando();
  }
  async present_autentificando(){
    this.loading = await this.loadingController.create({
      spinner: 'dots',
      duration: 3000,
      message: 'Autentificando',
      backdropDismiss: true,
      showBackdrop: true,
      keyboardClose: true,
      cssClass: 'custom-loading',
    });
    await this.loading.present();
  }
  verify_inputs(){
    let itsOk : boolean = false;
    if(typeof this.correo != 'undefined' && 
    this.correo.match('[A-z0-9.$-_#%&*/=+{}|~]+@+[A-z0-9.]+.+[a-z]{0,2}')){
      if(typeof this.clave != 'undefined' && this.clave.length >= 6){
        itsOk = true;
      }else{
        this.mensaje = 'Clave invalida'
      }
    }else{
      this.mensaje = 'Correo invalido';
    }
    return itsOk;
  }
  handle_error_on_request(reason : any){
    if(typeof this.loading != 'undefined'){this.loading.dismiss()}
    if(reason.status == 400){
      let errorMessage : string = reason.error.error.message;
      switch(errorMessage){
        case 'EMAIL_NOT_FOUND':
          this.mensaje = 'Correo no existente';
          break;
        case 'INVALID_PASSWORD':
          this.mensaje = 'Clave incorrecta';
          break;
        case 'TOO_MANY_ATTEMPTS_TRY_LATER : Too many unsuccessful login attempts. Please try again later.':
          this.mensaje = 'Demasiados intentos, espere';
          break;
        default:
          this.mensaje = 'Error en autentificacion';
          break;
      }
    }
  }
  handle_succesfull_request(response : any){
    if(typeof this.loading != 'undefined'){this.loading.dismiss()}
    console.log('Respuesta recibida, peticion exitosa.' + '['+ Date.now() + ']');
    if(typeof response.idToken != 'undefined'){
      console.log('Datos validos.' + '['+ Date.now() + ']');
      this.storage.set('pruebaAppToken', response.idToken);
      this.router.navigate(['home']);
    }
  }
}
