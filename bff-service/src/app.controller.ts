import { Req, Res } from '@nestjs/common';
import { All, Controller } from '@nestjs/common';
import { CacheService } from './app.service';
import { Request, Response } from 'express';
import { config } from 'dotenv';
import axios, { Method } from 'axios';

config({ path: '../.env' });

@Controller()
export class AppController {
  constructor(private readonly cacheService: CacheService) {}

  @All()
  async handleRequest(@Req() req: Request, @Res() res: Response) {
    console.log('originalUrl: ', req.originalUrl);
    console.log('method: ', req.method);
    console.log('body: ', req.body);

    const recipient = req.originalUrl.split('/')[1];
    console.log('recipient: ', recipient);

    const recipientUrl = process.env[recipient];
    console.log('recipientUrl: ', recipientUrl);

    if (recipientUrl) {
      const axiosConfig = {
        method: req.method as Method,
        url: `${recipientUrl}${req.originalUrl}`,
        ...(Object.keys(req.body || {}).length > 0 && { data: req.body }),
      };

      console.log('axiosConfig: ', axiosConfig);

      try {
        if (this.isCachedRequest(req)) {
          const cachedProducts = this.cacheService.getCache();
          if (cachedProducts) {
            res.json(cachedProducts);
            return;
          }
        }
        const response = await axios(axiosConfig);
        if (this.isCachedRequest(req)) {
          this.cacheService.setCache(response.data);
        }
        res.json(response.data);
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response;
          res.status(status).json(data);
        } else {
          res.status(500).json({ error: error.message });
        }
      }
    } else {
      res.status(502).json({ error: 'Cannot process request' });
    }
  }

  private isCachedRequest({ method, originalUrl }: Request): boolean {
    return method === 'GET' && originalUrl === '/products';
  }
}
