import { ApolloDriverConfig, ApolloDriver } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { MiddlewareConsumer, NestModule } from "@nestjs/common/interfaces";
import { GraphQLModule } from "@nestjs/graphql";
import { ServeStaticModule } from "@nestjs/serve-static";
import { path } from "app-root-path";
// import { graphqlUploadExpress } from "graphql-upload";
import { AppController } from "./app.controller";
import { AppResolver } from "./app.resolver";
import { AppService } from "./app.service";
import { MediaModule } from "./media/media.module";

@Module({
  imports: [
    MediaModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      resolvers: [AppResolver as any],
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: `${path}/uploads`,
      serveRoot: "/uploads",
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
