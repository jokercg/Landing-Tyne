import { TyneRoutes } from "../../infrastructure/enums/tyne-routes.enum";
import { DialogActions } from "./dialog-actions.enum";

export interface DialogModel {
  title: string;
  subtitle: string;
  isSuccessful: boolean;
  messageButton: string;
  messageButton2?: string;
  redirectTo?: TyneRoutes | string;
  action?: DialogActions | string;
  disableClose? : boolean
}