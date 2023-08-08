import { Directive, ElementRef} from '@angular/core';

@Directive({
  selector: '[appBillStyle]'
})
export class BillStyleDirective {
  value:any=""
  constructor(private eleRef:ElementRef) {
    eleRef.nativeElement.style.color="green"
   }

}
