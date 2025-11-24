import { useForm } from "@mantine/form";

import { CreateFaqFormInput, validateCreateFaqForm } from "../lib/form-schemas";

export function useFaqForm(initialValues?: Partial<CreateFaqFormInput>) {
    return useForm<CreateFaqFormInput>({
        mode: "uncontrolled",
        initialValues: {
            en_question: initialValues?.en_question ?? "",
            ar_question: initialValues?.ar_question ?? "",
            en_answer: initialValues?.en_answer ?? "",
            ar_answer: initialValues?.ar_answer ?? "",
        },
        validate: validateCreateFaqForm,
    });
}
