import { uploadToCloudinary } from "modules/core/network-utils";

interface DataRegistryStruct {
  screenshotId: string | null;
  onScreenshot: (screenshotId: string) => void;
}

let DataRegistry: DataRegistryStruct = {
  screenshotId: null,
  onScreenshot: () => {},
};

export class DataStore {
  private get registry() {
    return DataRegistry;
  }

  private set registry(newData) {
    DataRegistry = {
      ...DataRegistry,
      ...newData,
    };
  }

  public getScreenshotData() {
    return {
      screenshotId: this.registry.screenshotId,
      onScreenshot: this.registry.onScreenshot,
    };
  }

  public async takeScreenshot(id: string, boardId: string) {
    return new Promise((resolve, reject) => {
      this.registry = {
        ...this.registry,
        screenshotId: id,
        onScreenshot: (image: string) => {
          uploadToCloudinary(boardId, image);
          resolve(id);
        },
      };
    });
  }
}
