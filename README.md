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
