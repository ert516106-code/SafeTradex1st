import { createClient } from "@base44/sdk";
import { appParams } from "./app-params";

const {
  appId,
  token,
  functionsVersion,
  appBaseUrl
} = appParams;

export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl: "",
  requiresAuth: false,
  appBaseUrl
});
