import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UsersService} from '../services/users.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {



  constructor(private ngAuth: AuthService, private router: Router, private userService : UsersService) {}
  userdata : {name : string, desc : string, area : string} = {name: "", desc: "", area: ""};
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise(resolve => {
      this.ngAuth.getAuth().onAuthStateChanged(user => {
        if (user) {
          this.userdata = this.userService.getCollection(user.uid)
          if (this.userdata.desc == "" || this.userdata.desc == undefined || this.userdata.desc == null){
            console.log(this.userdata)
          this.router.navigate(["/config"]);
        
          }else{
            this.router.navigate(["/feed"]);
          }
          
        }

        resolve(!user ? true : false);
      });
    });
  }
  
}
