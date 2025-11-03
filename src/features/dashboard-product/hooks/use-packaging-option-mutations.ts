import { useRouter } from "next/navigation";

import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";

import { rpc } from "@/lib/rpc";

export function usePackagingOptionMutations() {
    const router = useRouter();

    const createMutation = useMutation(
        rpc.dashboardProduct.createPackagingOption.mutationOptions({
            onSuccess: async (_, __, ___, { client }) => {
                notifications.show({
                    title: "Packaging option created successfully",
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
                    title: "Failed to create packaging option",
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
                    title: "Packaging option updated successfully",
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
                    title: "Failed to update packaging option",
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
                    title: "Packaging option deleted successfully",
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
                    title: "Failed to delete packaging option",
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
