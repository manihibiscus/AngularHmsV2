import { Directive, ElementRef} from '@angular/core';

@Directive({
  selector: '[appBillStyle]'
})
export class BillStyleDirective {

  constructor(private eleRef:ElementRef) {
    eleRef.nativeElement.style.color="green"
   }

}
