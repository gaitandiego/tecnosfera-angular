export interface User {
  readonly email: string;
  readonly displayName: string;
  readonly role: 'admin' | 'editor';
}

export interface Credentials {
  readonly username: string;
  readonly password: string;
  readonly rememberMe: boolean;
}
