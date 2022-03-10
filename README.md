# Task Management w/ Authentication

### Module Decorator Properties

- providers :: Array of providers using dependency injection
- controllers :: to be instantiated within the module
- exports :: export to other modules
- import :: modules required by this module

As an example, we could define a Forum module with three submodules, namely, post, comment, and auth modules.

```typescript
@Module({
  providers: [ForumService],
  controllers: [ForumController],
  imports: [PostModule, CommentModule, AuthModule],
  exports: [ForumService],
})
export class ForumModule {}
```

### Pipes in NestJS

- **ValidationPipe** :: validates compatibility of entire object against a class (works with DTOs)
- **ParseIntPipe** :: validates argument is number -> transforming into Number if successful

Pipes are annotated with the `@Injectable()` decorator and must implement the PipeTransform generic interface (have a transform method).

```typescript
transform(value, metadata?) {}
```

> Handler-level Pipes :: defined at handler level, via the @UsePipes() decorator :: processes all parameters for incoming requests

```typescript
@Post()
@UsePipes(SomePipe)
createTask(
  @Body('description') description
) {
  // ...
}
```

> Parameter-level Pipes :: defined at parameter level :: processes the specified parameter

```typescript
@Post()
createTask(
  @Body('description', SomePipe) description
) {
  // ...
}
```

> Global Pipes :: applied to application level and to every incoming request

```typescript
async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  app.useGlobalPipes(SomePipe);
  await app.listen(3000);
}
bootstrap();
```

### Data Persistence

When setting up an entity model for interacting with a PostgreSQL database, we have two pattern options, namely,

(1) Active Record :: methods to interact with the db are defined within the model class itself
(2) Data Mapper :: methods are defined in a separate repository class

(Click here for more info)[https://orkhan.gitbook.io/typeorm/docs/active-record-data-mapper]

### Auth and Password Security

To make password hashing more secure, we are adding a "salt" part before the actual password, in order to establish the uniqueness of the password. This is even rainbow-table-proof.

e.g. instead of 123456 the password could be dj19da1_123456

> To protect specific routes so that they're accessible only by signed in users, use AuthGuard

### Interceptor

Alter something in the incoming request, e.g. process, change, transform data, etc.

Interceptors can be applied in multiple levels. In this project we add it to the application level.

### App Configuration

- Install the @nestjs/config module
- In app.module.ts -> import the config module and specify the env variables files, if needed
- Create the .env.stage.${process.env.STAGE} files
- To use the ConfigModule within another submodule (e.g. TasksModule), simply import it
- Use dependency injection to use the config service object
- To access an env var, use

```typescript
configService.get('ENV_VAR');
```

> In order to have access to the ConfigService env vars in the TypeOrmModule, we need to initialise it Async, so that we wait for the ConfigModule to set up.

### Deployment to Heroku

Add a Heroku remote that points to the application on Heroku

```bash
$ heroku git:remote -a task-management-constantine
```

Set necessary env vars

```bash
$ heroku config:set NPM_CONFIG_PRODUCTION=false
$ heroku config:set NODE_ENV=production
$ heroku config:set STAGE=prod
```

Set variables and credentials for DB

```bash
$ heroku config:set DB_HOST=ec2-176-34-105-15.eu-west-1.compute.amazonaws.com
$ heroku config:set DB_PORT=5432
$ heroku config:set DB_USERNAME=mzqnjuyvsmfazw
$ heroku config:set DB_PASSWORD=f3d0c699a478d2505bcdb311b700fc9cdb7125ee336df80be3df17112a671ace
$ heroku config:set DB_DATABASE=dcl5a80bg2gekg
$ heroku config:set JWT_SECRET=Xb2KK5jgnGFSqJf527m7jVmVenrmcRfyLwXZn9cCDT9ESn4A6YMB4evkPVuC
```

Create a Procfile as a pipeline for running the application (it has been already built before accessing this file).

```typescript
web: npm run start:prod
```

Staging changes and commiting, and then pushing to Heroku

```bash
$ git push -f heroku HEAD:master
```

Aligning our current HEAD with the remote's master branch.

To view the logs of the application,

```bash
$ heroku logs --tail
```
