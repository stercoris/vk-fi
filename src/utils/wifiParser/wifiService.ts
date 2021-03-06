import { Device } from "@Entities/Device";
import { User } from "@Entities/User";
import { delay } from "@Utils/delay";
import { findAndUpdateDevices } from "@Utils/wifiParser";

const isNewDevice = (previous: Device[], d: Device) =>
  !!!previous.find((prevD) => prevD.mac === d.mac);

const isDeviceWithChangedStatus = (previous: Device[], d: Device) =>
  !!previous.find(
    (prevD) => prevD.mac === d.mac && prevD.connected !== d.connected
  );

type NewDeviceCallback = (d: Device[]) => unknown | Promise<unknown>;

export class WiFiService {
  private static isRunning: boolean = false;

  private static callbacks: NewDeviceCallback[] = [];

  public static get Devices(): Promise<Device[]> {
    return Device.find();
  }

  public static start(): void {
    WiFiService.isRunning = true;
    void WiFiService.backgroundService();
  }
  public static stop(): void {
    WiFiService.isRunning = false;
  }

  public static onNewDevicesFinded(callback: NewDeviceCallback) {
    WiFiService.callbacks.push(callback);
  }

  private static async backgroundService(): Promise<void> {
    while (WiFiService.isRunning) {
      const previousDevices = await WiFiService.Devices;
      const currentDevices = await findAndUpdateDevices();

      const changedDevices = previousDevices.filter(
        (d) =>
          isNewDevice(currentDevices, d) ||
          isDeviceWithChangedStatus(currentDevices, d)
      );

      const devicesToReport = await Device.find({
        where: { mac: changedDevices.map((d) => d.mac) },
      });

      await Promise.all(WiFiService.callbacks.map((c) => c(devicesToReport)));

      await delay((await User.Master).pullInteval);
    }
  }
}
