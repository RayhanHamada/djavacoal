import {
    createFaq,
    deleteFaq,
    getFaqById,
    getFaqCount,
    listFaqs,
    reorderFaqs,
    updateFaq,
} from "./functions";

export const router = {
    listFaqs,
    getFaqById,
    createFaq,
    updateFaq,
    deleteFaq,
    reorderFaqs,
    getFaqCount,
};
