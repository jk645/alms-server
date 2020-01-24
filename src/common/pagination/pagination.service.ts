import { Injectable } from '@nestjs/common';
import { Page } from './page.dto';


@Injectable()
export class PaginationService {
  generatePage(data: any[], limit: number, skip: number, total: number): Page {
    return {
      total: total,
      limit: limit,
      skip: skip,
      data: data
    } as Page;
  }
}
