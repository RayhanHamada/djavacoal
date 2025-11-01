import { useRouter } from "next/navigation";

import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { rpc } from "@/lib/rpc";

export function usePackagingOptionMutations() {
    const router = useRouter();
    const t = useTranslations("PackagingOptions");

    const createMutation = useMutation(
        rpc.dashboardProduct.createPackagingOption.mutationOptions({
            onSuccess: async (_, __, ___, { client }) => {
                notifications.show({
                    title: t("form.success.created"),
                    message: "",
                    color: "green",
                });

                await Promise.all([
                    client.invalidateQueries({
                        queryKey:
                            rpc.dashboardProduct.listPackagingOptions.key(),
                    }),
                ]);
                router.push("/dashboard/products/packaging-options");
            },
            onError: () => {
                notifications.show({
                    title: t("form.errors.createFailed"),
                    message: "",
                    color: "red",
                });
            },
        })
    );

    const updateMutation = useMutation(
        rpc.dashboardProduct.updatePackagingOption.mutationOptions({
            onSuccess: async (_, __, ___, { client }) => {
                notifications.show({
                    title: t("form.success.updated"),
                    message: "",
                    color: "green",
                });

                await Promise.all([
                    client.invalidateQueries({
                        queryKey:
                            rpc.dashboardProduct.listPackagingOptions.key(),
                    }),
                    client.invalidateQueries({
                        queryKey:
                            rpc.dashboardProduct.getPackagingOptionById.key(),
                    }),
                ]);

                router.push("/dashboard/products/packaging-options");
            },
            onError: () => {
                notifications.show({
                    title: t("form.errors.updateFailed"),
                    message: "",
                    color: "red",
                });
            },
        })
    );

    const deleteMutation = useMutation(
        rpc.dashboardProduct.deletePackagingOption.mutationOptions({
            onSuccess: async (_, __, ___, { client }) => {
                notifications.show({
                    title: t("deleteModal.success"),
                    message: "",
                    color: "green",
                });

                await Promise.all([
                    client.invalidateQueries({
                        queryKey:
                            rpc.dashboardProduct.listPackagingOptions.key(),
                    }),
                    client.invalidateQueries({
                        queryKey:
                            rpc.dashboardProduct.getPackagingOptionById.key(),
                    }),
                ]);
            },
            onError: () => {
                notifications.show({
                    title: t("deleteModal.error"),
                    message: "",
                    color: "red",
                });
            },
        })
    );

    const generateUrlMutation = useMutation(
        rpc.dashboardProduct.generateImageUploadUrl.mutationOptions()
    );

    return {
        createMutation,
        updateMutation,
        deleteMutation,
        generateUrlMutation,
    };
}
