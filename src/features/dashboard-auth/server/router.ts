import {
    inviteAdmin,
    listAllAdmins,
    removeAdmin,
    updateMyName,
    changeMyPassword,
    checkNeedsPassword,
    setPassword,
} from "@/features/dashboard-auth/server/functions";

export const router = {
    listAllAdmins,
    inviteAdmin,
    removeAdmin,
    updateMyName,
    changeMyPassword,
    checkNeedsPassword,
    setPassword,
};
