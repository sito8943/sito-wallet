import {
  BaseDirectory,
  readTextFile,
  create,
  writeTextFile,
} from "@tauri-apps/plugin-fs";

export class TauriClient {
  constructor() {}

  async readFile(file: string) {
    return await readTextFile(file, {
      baseDir: BaseDirectory.AppLocalData,
    });
  }

  async writeTextFile(file: string, content: string) {
    await writeTextFile(file, content, { baseDir: BaseDirectory.AppLocalData });
  }

  async createFile(paramFile: string, content: string) {
    try {
      const file = await create(paramFile, {
        baseDir: BaseDirectory.AppLocalData,
      });
      await file.write(new TextEncoder().encode(content));
      await file.close();
    } catch (err) {
      console.error(err);
    }
  }
}
