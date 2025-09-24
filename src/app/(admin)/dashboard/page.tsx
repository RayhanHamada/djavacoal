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
  Badge,
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

  const tableColumns = ["ID", "Name", "Role", "Status", "Last Active"];
  const tableRows = [
    ["U-1842", "Jane Cooper", "Editor", "Active", "2m ago"],
    ["U-1033", "Wade Warren", "Author", "Idle", "14m ago"],
    ["U-9277", "Brooklyn Simmons", "Moderator", "Active", "5m ago"],
    ["U-5521", "Devon Lane", "Viewer", "Disabled", "—"],
    ["U-6612", "Theresa Webb", "Admin", "Active", "1m ago"],
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

  // Component: Placeholder data table
  const DataTable = () => (
    <Paper withBorder radius="md" p="0">
      <Box p="md" pb="sm">
        <Group justify="space-between" align="flex-end">
          <Box>
            <Text
              fw={600}
              size="sm"
              tt="uppercase"
              c="dimmed"
              style={{ letterSpacing: 0.8 }}
            >
              Users Snapshot
            </Text>
            <Title order={4} mt={2} fw={600}>
              Recent Directory
            </Title>
          </Box>
          <Badge variant="outline" size="sm" radius="sm">
            Static Preview
          </Badge>
        </Group>
      </Box>
      <Divider />
      <Box component="div" style={{ overflowX: "auto" }}>
        <Box
          component="table"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <Box
            component="thead"
            style={{ background: "var(--mantine-color-gray-1)" }}
          >
            <Box component="tr">
              {tableColumns.map((col) => (
                <Box
                  component="th"
                  key={col}
                  style={{
                    textAlign: "left",
                    padding: "10px 14px",
                    fontSize: rem(11),
                    fontWeight: 600,
                    letterSpacing: 0.6,
                    textTransform: "uppercase",
                    color: "var(--mantine-color-dimmed)",
                    borderBottom: "1px solid var(--mantine-color-gray-3)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {col}
                </Box>
              ))}
            </Box>
          </Box>
          <Box component="tbody">
            {tableRows.map((row, idx) => (
              <Box
                component="tr"
                key={row[0]}
                style={{
                  backgroundColor:
                    idx % 2 === 0
                      ? "var(--mantine-color-body)"
                      : "var(--mantine-color-gray-0)",
                }}
              >
                {row.map((cell, ci) => (
                  <Box
                    component="td"
                    key={ci}
                    style={{
                      padding: "10px 14px",
                      fontSize: rem(13),
                      borderBottom: "1px solid var(--mantine-color-gray-3)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {cell === "Disabled" ? (
                      <Badge color="gray" variant="light" size="sm">
                        {cell}
                      </Badge>
                    ) : cell === "Active" ? (
                      <Badge color="teal" variant="light" size="sm">
                        {cell}
                      </Badge>
                    ) : cell === "Idle" ? (
                      <Badge color="yellow" variant="light" size="sm">
                        {cell}
                      </Badge>
                    ) : (
                      cell
                    )}
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <Box p="sm">
        <Text size="xs" c="dimmed">
          This table is a static design sample. Add data-fetch + pagination
          logic externally.
        </Text>
      </Box>
    </Paper>
  );

  // Component: Main content assembly
  const Content = () => (
    <Stack gap="xl">
      <StatsSection />
      <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="lg">
        <Box style={{ gridColumn: "span 2" }}>
          <DataTable />
        </Box>
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
