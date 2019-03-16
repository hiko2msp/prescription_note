import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'cdvfile' })
export class CDVFile implements PipeTransform {

    constructor(private sanitizer: DomSanitizer) { }

    transform(url: string) {
        return url
            ? url.startsWith('cdvfile://') ? this.sanitizer.bypassSecurityTrustUrl(url) : url
            : '';
    }
}
