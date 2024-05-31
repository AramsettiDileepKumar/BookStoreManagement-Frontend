import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipe',
})
export class PipePipe implements PipeTransform {
  transform(items: any, searchString: string) {
    if (!items) return [];
    if (!searchString) return items;
    searchString = searchString.toLowerCase();
    return items.filter(
      (item: { bookName: string; authorName: string }) =>
        item.bookName.toLowerCase().includes(searchString) ||
        item.authorName.toLowerCase().includes(searchString)
    );
  }
}
