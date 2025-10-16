import {
  inviteAdmin,
  listAllAdmins,
  removeAdmin,
} from "@/features/admin-auth/server/functions";

export const router = {
  listAllAdmins,
  inviteAdmin,
  removeAdmin,
};
