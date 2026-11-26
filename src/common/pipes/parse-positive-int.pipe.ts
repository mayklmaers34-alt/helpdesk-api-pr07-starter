import { PipeTransform, Injectable, BadRequestException, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ParsePositiveIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = Number(value);
    if (!/^\d+$/.test(value) || !Number.isSafeInteger(val) || val < 1) {
      throw new BadRequestException(`Параметр ${metadata.data} має бути цілим додатним числом`);
    }
    return val;
  }
}