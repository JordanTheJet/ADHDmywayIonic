import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'signup', loadChildren: './signup/signup.module#SignupPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'game', loadChildren: './game/game.module#GamePageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
