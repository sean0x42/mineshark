import bunyan from "bunyan";

export const log = bunyan.createLogger({
  name: "mineshark",
  level: "trace",
});
