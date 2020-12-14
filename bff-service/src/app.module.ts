import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CacheService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [CacheService],
})
export class AppModule {}
