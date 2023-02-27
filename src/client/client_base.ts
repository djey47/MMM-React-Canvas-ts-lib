import { NotificationCatcher } from "./hooks/with-notifications/notification-catcher";
import * as Notifications from '../shared/support/notifications';
import { MainComponentInfo, renderMainComponent, renderWrapper } from "./dom/renderer";

class ClientBase {
  helperLoaded: boolean;
  mainComponentInfo: MainComponentInfo;
  moduleInstance: MM2ModuleProperties;
  viewEngineStarted: boolean;

  constructor(moduleProperties: MM2ModuleProperties, mainComponent: MainComponentInfo) {
    this.helperLoaded = false;
    this.mainComponentInfo = mainComponent;
    this.moduleInstance = moduleProperties;
    this.viewEngineStarted = false;
  }
  
  getWrapperId(): string {
    return `${this.moduleInstance.name}Wrapper`.replace(/-/g, '');
  };

  getStyles(): string[] {
    return [
      this.moduleInstance.file ? this.moduleInstance.file('styles.css') : '', // Webpack bundle
      'font-awesome.css', // FIXME necessary?
    ];
  }

  start(): void {
    this.debugLog(`**** Starting module: ${this.moduleInstance.name}`);
    this.debugLog(`**** Module configuration: ${JSON.stringify(this.moduleInstance.config)}`);

    // Global state
    this.helperLoaded = false;
    this.viewEngineStarted = false;

    const isDebugMode = !!this.moduleInstance.config?.debug;
    NotificationCatcher.getInstance({ isDebugMode });

    this.debugLog('**** Sending configuration to helper...');

    if (this.moduleInstance.sendSocketNotification) {
      this.moduleInstance.sendSocketNotification(Notifications.NOTIF_SET_CONFIG, this.moduleInstance.config);
    }
  }

  /**
   * Overrides DOM generator.
   * At first, it will create module wrapper and return it to be correctly attached to MM2 app.
   * When helper is loaded (configuration updated server-side), will start REACT engine.
   */
  getDom(): HTMLDivElement | undefined {
    if (this.viewEngineStarted) {
      return undefined;
    }
    const wrapperId = this.getWrapperId();
    return renderWrapper(wrapperId);
  }

  notificationReceived(notification: string) {
    this.debugLog(`**** ${this.moduleInstance.name}::notificationReceived: ${notification}`);

    if (notification === Notifications.NOTIF_DOM_OBJECTS_CREATED) {
      renderMainComponent(this.getWrapperId(), this.mainComponentInfo, this.moduleInstance.config);
      this.viewEngineStarted = true;
    }

    NotificationCatcher.getInstance().catchNotification(notification);
  }

  socketNotificationReceived(
    notification: string,
    payload: unknown
  ): void {
    this.debugLog(
      `**** ${
        this.moduleInstance.name
      }::socketNotificationReceived: ${notification} ${JSON.stringify(
        payload,
        null,
        2
      )}`
    );

    switch (notification) {
      case Notifications.NOTIF_INIT:
        this.helperLoaded = true;
        break;
      /* Handle other notification types here ... */
    }

    NotificationCatcher.getInstance().catchNotification(notification, payload);
  }

  debugLog(data: string) {
    if (this.moduleInstance.config?.debug) {
      Log.log(data);
    }
  }
}

export default ClientBase;
