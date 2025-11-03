import {
    inviteAdmin,
    listAllAdmins,
    removeAdmin,
    updateMyName,
    changeMyPassword,
} from "@/features/dashboard-auth/server/functions";

export const router = {
    listAllAdmins,
    inviteAdmin,
    removeAdmin,
    updateMyName,
    changeMyPassword,
};
