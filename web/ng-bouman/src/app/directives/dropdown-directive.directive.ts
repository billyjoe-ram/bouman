import { Directive, ElementRef, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirectiveDirective {    
  
  @HostBinding("class.open") private added: boolean = false;
  
  constructor(private elmRef: ElementRef) { }

  @HostListener("document:click", ["$event"]) toggleClass(event: Event) {    
    this.added = this.elmRef.nativeElement.contains(event.target) ? !this.added : false;
  }

}
