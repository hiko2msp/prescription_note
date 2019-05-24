import { PipeTransform, Pipe } from '@angular/core';

// 配列をObjectのKeyの降順でソートするパイプ
@Pipe({
    name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {
    transform(array: any[], field: string): any[] {
        if (array && array.length > 0) {
            array.sort((a: any, b: any) => {
                if (a[field] > b[field]) {
                    return -1;
                } else if (a[field] < b[field]) {
                    return 1;
                } else {
                    return 0;
                }
            });
        }
        return array;
    }
}
