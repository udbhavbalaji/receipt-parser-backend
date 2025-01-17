interface UserDB {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  user_id: string;
  logged_in?: "Y" | "N";
  last_generated_token: string | null;
}

export { UserDB };
