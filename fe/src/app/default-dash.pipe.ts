import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'defaultDash',
  standalone: true
})
export class DefaultDashPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return value? value : "-";
  }

}
