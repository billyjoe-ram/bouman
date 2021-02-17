import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public signed: boolean = false;  

  constructor() { }

  ngOnInit(): void {
  }

  checkSigned(state: string) {
    state === 'true' ? this.signed = true : false;
    console.log(state);
    console.log(this.signed);
    
  }

}
