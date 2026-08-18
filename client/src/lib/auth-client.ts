export interface AuthConfig {
  authOrigin: string;
  enabled: boolean;
}

export interface ExternalIdentity {
  email: string;
  provider: "google";
  sub: string;
}

export function resolveAuthConfig(enabledFlag: string | undefined, configuredOrigin: string | undefined): AuthConfig {
  const authOrigin = configuredOrigin ?? "https://auth.pixelgame.pro";
  return {
    authOrigin,
    enabled: enabledFlag === "true" && authOrigin.startsWith("https://"),
  };
}

export function providerLoginUrl(authOrigin: string, provider: ExternalIdentity["provider"]): string {
  return `${authOrigin}/v1/login/${provider}`;
}
