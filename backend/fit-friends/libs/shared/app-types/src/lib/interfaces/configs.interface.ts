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
