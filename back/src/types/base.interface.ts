import { IPost, IUser } from "src/db.service";

export interface IBase {
  getUsers: () => void;
  registration: (
    login: string,
    password: string
  ) => Promise<{ login?: string; token?: string; error?: string }>;
  clear: () => void;
  auth: (
    login: string,
    password: string
  ) => Promise<{ error?: string; user?: IUser }>;
  check: (
    token: string
  ) => Promise<{ error?: string; login?: string; userId?: string }>;
  getPost: () => Promise<{ error?: string; posts?: unknown[] }>;
  getPostById: (id: string) => Promise<{
    error?: string;
    post?: Omit<IPost, "author"> & { author: IUser & { id: string } };
  }>;
  addPost: (
    userId: string,
    dto: Omit<IPost, "author">
  ) => Promise<{ error?: string; post?: string }>;
  updatePost: (postId: string, dto: Partial<IPost>) => void;
  removePost: (postId: string) => void;
}
