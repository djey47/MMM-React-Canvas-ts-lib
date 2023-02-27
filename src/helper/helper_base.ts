import { NOTIF_INIT, NOTIF_SET_CONFIG } from '../shared/support/notifications';
import { MM2Helper } from '../types/mm2';

interface HelperBaseConfiguration {
  debug?: boolean;
}

class HelperBase {
  config?: HelperBaseConfiguration 
  helperImplInstance: MM2Helper
  started: boolean

  constructor(helperImpl: MM2Helper) {
    this.config = undefined;
    this.helperImplInstance = helperImpl;
    this.started = false;   
  }

  start() {
    this.started = false;
  }

  socketNotificationReceived(notification: string, payload: object) {
    if (notification === NOTIF_SET_CONFIG && !this.started) {
      this.config = payload;
      this.started = true;
      // Calling inherited method
      if (this.helperImplInstance.sendSocketNotification) {
        this.helperImplInstance.sendSocketNotification(NOTIF_INIT);
      }
    }
  }
  
  stop(): void {
    // TODO add cleaning and termination code here...
  }

};

export default HelperBase;
