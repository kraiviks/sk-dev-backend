import { Controller, Get, Query, Res, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { Response } from 'express';

@Controller('image')
export class ImageController {
  @Get('proxy')
  async getImageProxy(@Query('url') url: string, @Res() res: Response) {
    try {
      // Отримання зображення через axios
      const response = await axios.get(url, { responseType: 'arraybuffer' });

      // Передача заголовків та контенту клієнту
      res.setHeader('Content-Type', response.headers['content-type']);
      res.status(HttpStatus.OK).send(response.data);
    } catch (error) {
      console.error('Помилка при отриманні зображення:', error);
      res.status(HttpStatus.BAD_REQUEST).send('Неможливо отримати зображення');
    }
  }
}
