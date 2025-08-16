export const userTypes: string[] = ['student', 'teacher', 'parent', 'private_tutor'];

export type UserType = (typeof userTypes)[number];

export type NewUser = {
  name: string;
  email: string;
  password: string;
  type: UserType;
};

export type CreatedUser = {
  id: string;
  name: string;
  email: string;
  type: UserType;
};
