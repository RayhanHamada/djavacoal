import {
    getNewsById,
    getProductById,
    listNews,
    listProducts,
} from "./functions";

// Export router (basic structure without OpenAPI for now)
export const router = {
    listProducts,
    getProductById,
    listNews,
    getNewsById,
};

export type PublicAPIRouter = typeof router;
