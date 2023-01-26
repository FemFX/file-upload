//@ts-nocheck
import { UseInterceptors, UploadedFile } from "@nestjs/common";
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ObjectType,
  Field,
} from "@nestjs/graphql";
import { FileInterceptor } from "@nestjs/platform-express";
import path from "path";
import fs from "fs";
import { ensureDir, writeFile } from "fs-extra";
import { AppService } from "./app.service";
import { GraphqlFileFieldsInterceptor } from "./gqlInterceptor";
import { IMediaResponse } from "./media/media.interface";
import { GraphQLUpload } from "apollo-server-express";

@ObjectType()
export class File {
  @Field()
  url: string;
}

@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {}
  @Query(() => String)
  hello(): string {
    return "hello";
  }
  // @Mutation(() => Boolean, { nullable: true })
  // @UseInterceptors(GraphqlFileFieldsInterceptor([{ name: "media" }]))
  // async addImage(@Args("media") media: string) {
  //   console.log(media);
  //   return true;
  // }
  // @Mutation(() => File)
  // async addImage(
  //   @Args("attachment", { type: () => GraphQLUpload })
  //   attachment: Promise<FileUpload>
  // ): Promise<File> {
  //   const { createReadStream, filename } = await file.file;
  //   const stream = createReadStream();
  //   const pathName = path.join(__dirname, "../uploads");
  //   await stream.pipe(fs.createWriteStream(pathName));
  //   return {
  //     url: `http://localhost:3001/uploads/${filename}`,
  //   };
  // }
  @Mutation(() => Boolean)
  async uploadFile(
    @Args({ name: "file", type: () => GraphQLUpload })
    { createReadStream, filename }
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(`./uploads/${filename}`))
        .on("finish", () => resolve(true))
        .on("error", () => reject(false))
    );
  }
}
