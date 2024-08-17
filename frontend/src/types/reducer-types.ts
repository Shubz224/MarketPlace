import { User } from "./types";

export interface userReducerInitialstate{
    user:User | null ;
    loading :boolean;
}