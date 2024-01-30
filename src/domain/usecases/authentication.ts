export interface AuthenticationModel {
  password: string
  email: string
}

export interface Authentication {
  auth: (authentication: AuthenticationModel) => Promise<string>
}
