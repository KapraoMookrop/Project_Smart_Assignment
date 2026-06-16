import { Pipe, PipeTransform } from '@angular/core';
import { getDisplayableUrl } from '../utils/url-helper';

@Pipe({
  name: 'displayableUrl',
  standalone: true
})
export class DisplayableUrlPipe implements PipeTransform {
  transform(url: string | undefined): string {
    return getDisplayableUrl(url);
  }
}
