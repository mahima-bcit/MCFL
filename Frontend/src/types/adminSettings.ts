export type AdminAccountSettings = {
  email: string;
  mustChangePassword: boolean;
};

export type ChangeAdminPasswordRequest = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};