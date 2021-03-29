import { MiddlewareConsumer, Module, NestModule, RequestMethod, Type } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { DbModule } from '../../db/db.module';
import { SearchModule } from '../search/search.module';
import { PostController } from './controller/user.controller';

export const ALL_ENTITIES = fs.readdirSync(path.join(path.dirname(__filename), 'entities'))
  .filter((file) => (path.extname(file) === '.js' || path.extname(file) === '.ts') && !file.endsWith('.d.ts'))
  .map((file) => require(`./entities/${file}`).default as Type<any>);

export const ALL_SERVICES = fs.readdirSync(path.join(path.dirname(__filename), 'services'))
  .filter((file) => (path.extname(file) === '.js' || path.extname(file) === '.ts') && !file.endsWith('.d.ts'))
  .filter((file) => file.indexOf('.spec') === -1)
  .map((file) => require(`./services/${file}`).default as Type<any>);

@Module({
  imports: [
    SearchModule,
    DbModule.forRoot({ entities: ALL_ENTITIES }),
    TypeOrmModule.forFeature(ALL_ENTITIES)
  ],
  controllers: [PostController],
  providers: [
    ...ALL_SERVICES,
  ],
  exports: [...ALL_SERVICES],
})
export class DomainModule { }
