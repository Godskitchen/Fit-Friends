export interface AppConfig {
  host: string;
  environment: string;
  port: string;
}

export interface DbConfig {
  host: string;
  name: string;
  port: string;
  user: string;
  password: string;
  authBase?: string;
}

export interface StaticConfig {
  uploadDirectory: string;
  serveRoot: string;
}

export interface MailerConfig {
  host: string;
  port: string;
  user: string;
  password: string;
  from: string;
  broadcastInterval: string;
}
