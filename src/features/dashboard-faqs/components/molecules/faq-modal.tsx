"use client";

import { useEffect, useState } from "react";

import {
    Button,
    Modal,
    SegmentedControl,
    Stack,
    TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";

import { useFaqForm } from "../../hooks";
import {
    CreateFaqFormInput,
    FAQ_ANSWER_MAX_LENGTH,
    FAQ_QUESTION_MAX_LENGTH,
} from "../../lib";
import { UpdateFaqInput } from "../../server/schemas";
import { FaqRichTextEditor } from "../atoms";
import { rpc } from "@/lib/rpc";

interface FaqModalProps {
    opened: boolean;
    onClose: () => void;
    faqToEdit?: {
        id: number;
        en_question: string;
        ar_question: string;
        en_answer: string;
        ar_answer: string;
    };
}

export function FaqModal({ opened, onClose, faqToEdit }: FaqModalProps) {
    const isEditMode = !!faqToEdit;
    const [selectedLanguage, setSelectedLanguage] = useState<"en" | "ar">("en");

    const form = useFaqForm();

    // Update form values when faqToEdit changes or modal opens
    useEffect(() => {
        if (opened && faqToEdit) {
            form.setValues({
                en_question: faqToEdit.en_question,
                ar_question: faqToEdit.ar_question,
                en_answer: faqToEdit.en_answer,
                ar_answer: faqToEdit.ar_answer,
            });
        } else if (opened && !faqToEdit) {
            form.reset();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [opened, faqToEdit]);

    const createMutation = useMutation(
        rpc.dashboardFaqs.createFaq.mutationOptions({
            onMutate() {
                notifications.show({
                    title: "Creating FAQ...",
                    message: "Please wait while we create the FAQ.",
                    color: "blue",
                });
            },
            onSuccess: (_, __, ___, { client }) => {
                notifications.show({
                    title: "Success",
                    message: "FAQ created successfully",
                    color: "green",
                });

                client.invalidateQueries({
                    queryKey: rpc.dashboardFaqs.listFaqs.key(),
                });

                form.reset();
                onClose();
            },
            onError: (error: Error) => {
                notifications.show({
                    title: "Error",
                    message: error.message || "Failed to create FAQ",
                    color: "red",
                });
            },
        })
    );

    const updateMutation = useMutation(
        rpc.dashboardFaqs.updateFaq.mutationOptions({
            onMutate() {
                notifications.show({
                    title: "Updating FAQ...",
                    message: "Please wait while we update the FAQ.",
                    color: "blue",
                });
            },
            onSuccess: (_, __, ___, { client }) => {
                notifications.show({
                    title: "Success",
                    message: "FAQ updated successfully",
                    color: "green",
                });

                client.invalidateQueries({
                    queryKey: rpc.dashboardFaqs.listFaqs.key(),
                });

                onClose();
            },
            onError: (error: Error) => {
                notifications.show({
                    title: "Error",
                    message: error.message || "Failed to update FAQ",
                    color: "red",
                });
            },
        })
    );

    const handleSubmit = (values: CreateFaqFormInput) => {
        if (isEditMode && faqToEdit) {
            const updateData: UpdateFaqInput = {
                id: faqToEdit.id,
                ...values,
            };
            updateMutation.mutate(updateData);
        } else {
            createMutation.mutate(values);
        }
    };

    const handleClose = () => {
        form.reset();
        setSelectedLanguage("en");
        onClose();
    };

    const isPending = createMutation.isPending || updateMutation.isPending;

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title={isEditMode ? "Edit FAQ" : "Create FAQ"}
            size="lg"
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">
                    <SegmentedControl
                        value={selectedLanguage}
                        onChange={(value) =>
                            setSelectedLanguage(value as "en" | "ar")
                        }
                        data={[
                            { label: "English", value: "en" },
                            { label: "Arabic", value: "ar" },
                        ]}
                        fullWidth
                    />

                    {selectedLanguage === "en" ? (
                        <>
                            <TextInput
                                label="English Question"
                                placeholder="Enter question in English"
                                required
                                key={form.key("en_question")}
                                {...form.getInputProps("en_question")}
                                maxLength={FAQ_QUESTION_MAX_LENGTH}
                            />

                            <FaqRichTextEditor
                                key="en-answer"
                                label="English Answer"
                                placeholder="Enter answer in English"
                                value={form.getValues().en_answer}
                                onChange={(value) =>
                                    form.setFieldValue("en_answer", value)
                                }
                                error={
                                    form.errors.en_answer
                                        ? String(form.errors.en_answer)
                                        : undefined
                                }
                                maxLength={FAQ_ANSWER_MAX_LENGTH}
                            />
                        </>
                    ) : (
                        <>
                            <TextInput
                                label="Arabic Question"
                                placeholder="أدخل السؤال بالعربية"
                                key={form.key("ar_question")}
                                {...form.getInputProps("ar_question")}
                                maxLength={FAQ_QUESTION_MAX_LENGTH}
                                dir="rtl"
                            />

                            <FaqRichTextEditor
                                key="ar-answer"
                                label="Arabic Answer"
                                placeholder="أدخل الإجابة بالعربية"
                                value={form.getValues().ar_answer}
                                onChange={(value) =>
                                    form.setFieldValue("ar_answer", value)
                                }
                                error={
                                    form.errors.ar_answer
                                        ? String(form.errors.ar_answer)
                                        : undefined
                                }
                                maxLength={FAQ_ANSWER_MAX_LENGTH}
                            />
                        </>
                    )}

                    <div
                        style={{
                            display: "flex",
                            gap: "12px",
                            justifyContent: "flex-end",
                            marginTop: "16px",
                        }}
                    >
                        <Button
                            variant="subtle"
                            onClick={handleClose}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" loading={isPending}>
                            {isEditMode ? "Update FAQ" : "Create FAQ"}
                        </Button>
                    </div>
                </Stack>
            </form>
        </Modal>
    );
}
