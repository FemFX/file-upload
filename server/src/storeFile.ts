//@ts-nocheck
import { v4 } from "uuid";
import fs from "fs";
import path from "path";

const dir = "../uploads";
// if (!fs.existsSync(dir)) {
//   fs.mkdirSync(dir);
// }

export const storeFile = async (file, options): Promise<any> => {
  // options is not doing anything right now
  const { stream } = await file;
  const filename = v4();

  const fileAddress = path.join(dir, filename + ".jpg");
  return new Promise((resolve, reject) =>
    stream
      .on("error", (error) => {
        if (stream.truncated)
          // Delete the truncated file
          fs.unlinkSync(fileAddress);
        reject(error);
      })
      .pipe(fs.createWriteStream(fileAddress))
      .on("error", (error) => reject(error))
      .on("finish", () => resolve(fileAddress))
  );
};
