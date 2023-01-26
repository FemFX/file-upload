import { Observable } from "rxjs";
import {
  NestInterceptor,
  Optional,
  ExecutionContext,
  mixin,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { storeFile } from "./storeFile";

interface IField {
  name: string;
  options?: any;
}

export function GraphqlFileFieldsInterceptor(
  uploadFields: IField[],
  localOptions?: any
) {
  class MixinInterceptor implements NestInterceptor {
    options: any = {};
    constructor(@Optional() options: any = {}) {
      this.options = { ...options, ...localOptions };
    }
    //@ts-ignore
    async intercept(
      context: ExecutionContext,
      call$: Observable<any>
    ): Promise<Observable<any>> {
      const ctx = GqlExecutionContext.create(context);
      const args = ctx.getArgs();

      let storeFilesResult = await Promise.all(
        uploadFields.map((uploadField) => {
          const file = args[uploadField.name];
          return storeFile(file, {
            ...uploadField.options,
            ...this.options,
          }).then((address) => {
            args[uploadField.name] = address;
            return address;
          });
        })
      );

      return call$;
    }
  }
  const Interceptor = mixin(MixinInterceptor);
  return Interceptor;
}
