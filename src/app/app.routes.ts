import { Routes } from '@angular/router';
import { Register } from './register/Register.1';
import { Login } from './login/login';
import { UserProfile } from './userprofile/user-profile';
import { Actionplan } from './actionplan/actionplan';

export const routes: Routes = [
    {path:'register', component: Register},
    {path:'login', component: Login},
    {path:'profile', component: UserProfile},
    {path: 'actionplan', component: Actionplan}
];
