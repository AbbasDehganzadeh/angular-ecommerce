import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "truncate", standalone: true })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: string) {
    let numLim = Number(limit.substring(0, limit.length - 1));
    let charLim = limit.at(-1);
    if (charLim === "w") {
      const words = value.split(" ");
      return words.slice(0, numLim).join(" ");
    }
    return value.length > numLim ? value.slice(0, numLim) : value;
  }
}
