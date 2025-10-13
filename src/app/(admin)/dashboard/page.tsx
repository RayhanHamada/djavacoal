"use client";
import React from "react";

import {
  AppShell,
  AppShellHeader,
  AppShellNavbar,
  AppShellMain,
  ScrollArea,
  Group,
  Stack,
  Box,
  NavLink,
  Title,
  Text,
  Paper,
  SimpleGrid,
  ThemeIcon,
  Divider,
  Anchor,
  rem,
} from "@mantine/core";

import {
  IconHome,
  IconArticle,
  IconUser,
  IconLayoutDashboard,
  IconChevronRight,
  IconBrandProducthunt,
  IconPlus,
  IconList,
  IconMail,
} from "@tabler/icons-react";

export default function Page() {
  // Data structures (pure, no handlers)
  const navigation = [
    {
      label: "Dashboard",
      icon: IconHome,
      href: "/dashboard",
      description: "Back to Dashboard Home",
    },
    {
      label: "Products",
      icon: IconArticle,
      description: "Product management",
      children: [
        {
          label: "Manage Products",
          icon: IconList,
          href: "/dashboard/products",
        },
        {
          label: "Create Product",
          icon: IconPlus,
          href: "/dashboard/products/create",
        },
      ],
    },
    {
      label: "Articles",
      icon: IconArticle,
      description: "Content management",
      children: [
        {
          label: "Manage Article",
          icon: IconPlus,
          href: "/dashboard/articles",
        },
        {
          label: "Create Article",
          icon: IconPlus,
          href: "/dashboard/articles/create",
        },
      ],
    },
    {
      label: "Admin",
      icon: IconLayoutDashboard,
      description: "Administrative panels",
      children: [
        { label: "Users", icon: IconUser, href: "/dashboard/admins" },
        {
          label: "Invite User",
          icon: IconMail,
          href: "/dashboard/admins/invite",
        },
      ],
    },
    {
      label: "Page Settings",
      icon: IconLayoutDashboard,
      description: "Page configurations",
      href: "/dashboard/settings",
    },
  ];

  const stats = [
    { label: "Articles", value: "342", icon: IconArticle, tone: "grape" },
    {
      label: "Products",
      value: "4",
      icon: IconBrandProducthunt,
      tone: "teal",
    },
  ];

  // Component: Navigation tree
  const SideNavigation = () => (
    <ScrollArea style={{ flex: 1 }}>
      <Stack gap="xs" p="sm">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              label={item.label}
              description={item.description}
              leftSection={<Icon size={18} stroke={1.7} />}
              component="a"
              href={item.href}
              childrenOffset={rem(14)}
              opened
            >
              {item.children?.map((child) => {
                const CIcon = child.icon;
                return (
                  <NavLink
                    key={child.label}
                    label={child.label}
                    component="a"
                    href={child.href}
                    leftSection={<CIcon size={16} stroke={1.6} />}
                    rightSection={<IconChevronRight size={14} stroke={1.4} />}
                  />
                );
              })}
            </NavLink>
          );
        })}
      </Stack>
    </ScrollArea>
  );

  // Component: Header
  const HeaderBar = () => (
    <Group h="100%" px="md" justify="space-between">
      <Group gap="xs">
        <ThemeIcon
          size="lg"
          radius="md"
          variant="gradient"
          gradient={{ from: "indigo", to: "cyan" }}
        >
          <IconLayoutDashboard size={20} stroke={1.8} />
        </ThemeIcon>
        <Box>
          <Title order={4} fw={600}>
            Djavacoal Admin
          </Title>
          <Text size="xs" c="dimmed">
            Content Management System
          </Text>
        </Box>
      </Group>
    </Group>
  );

  // Component: Stats grid
  const StatsSection = () => (
    <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="md" mb="lg">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <Paper
            key={s.label}
            p="md"
            radius="md"
            withBorder
            style={{
              display: "flex",
              flexDirection: "column",
              gap: rem(6),
            }}
          >
            <Group gap="xs">
              <ThemeIcon
                variant="light"
                radius="md"
                size="lg"
                color={s.tone as any}
              >
                <Icon size={18} stroke={1.7} />
              </ThemeIcon>
              <Text
                size="xs"
                c="dimmed"
                fw={500}
                tt="uppercase"
                style={{ letterSpacing: 0.5 }}
              >
                {s.label}
              </Text>
            </Group>
            <Text fz={28} fw={600} lh={1.1}>
              {s.value}
            </Text>
            <Divider variant="dashed" />
          </Paper>
        );
      })}
    </SimpleGrid>
  );

  // Component: Main content assembly
  const Content = () => (
    <Stack gap="xl">
      <StatsSection />
      <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="lg">
        <Box style={{ gridColumn: "span 2" }}></Box>
      </SimpleGrid>
    </Stack>
  );

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{ width: 280, breakpoint: "sm" }}
    >
      <AppShellHeader>
        <HeaderBar />
      </AppShellHeader>
      <AppShellNavbar p={0}>
        <SideNavigation />
        <Divider />
        <Box p="sm">
          <Text size="xs" c="dimmed">
            Need more sections? Just extend navigation[].
          </Text>
          <Anchor
            size="xs"
            c="dimmed"
            underline="hover"
            href="https://mantine.dev"
            target="_blank"
          >
            Mantine Docs
          </Anchor>
        </Box>
      </AppShellNavbar>
      <AppShellMain>
        <Content />
      </AppShellMain>
    </AppShell>
  );
}
