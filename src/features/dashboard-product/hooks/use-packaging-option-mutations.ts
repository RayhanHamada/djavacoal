import { useRouter } from "next/navigation";

import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { rpc } from "@/lib/rpc";

export function usePackagingOptionMutations() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const t = useTranslations("PackagingOptions");

    const createMutation = useMutation({
        ...rpc.dashboardProduct.createPackagingOption.mutationOptions(),
        onSuccess: () => {
            notifications.show({
                title: t("form.success.created"),
                message: "",
                color: "green",
            });
            queryClient.invalidateQueries({
                queryKey: rpc.dashboardProduct.listPackagingOptions.key(),
            });
            router.push("/dashboard/products/packaging-options");
        },
        onError: () => {
            notifications.show({
                title: t("form.errors.createFailed"),
                message: "",
                color: "red",
            });
        },
    });

    const updateMutation = useMutation({
        ...rpc.dashboardProduct.updatePackagingOption.mutationOptions(),
        onSuccess: () => {
            notifications.show({
                title: t("form.success.updated"),
                message: "",
                color: "green",
            });
            queryClient.invalidateQueries({
                queryKey: rpc.dashboardProduct.listPackagingOptions.key(),
            });
            queryClient.invalidateQueries({
                queryKey: rpc.dashboardProduct.getPackagingOptionById.key(),
            });
            router.push("/dashboard/products/packaging-options");
        },
        onError: () => {
            notifications.show({
                title: t("form.errors.updateFailed"),
                message: "",
                color: "red",
            });
        },
    });

    const deleteMutation = useMutation(
        rpc.dashboardProduct.deletePackagingOption.mutationOptions({
            onSettled: () => {
                queryClient.invalidateQueries({
                    queryKey: rpc.dashboardProduct.listPackagingOptions.key(),
                });
                queryClient.invalidateQueries({
                    queryKey: rpc.dashboardProduct.getPackagingOptionById.key(),
                });
            },
            onSuccess: () => {
                notifications.show({
                    title: t("deleteModal.success"),
                    message: "",
                    color: "green",
                });
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
