import { redirect } from "next/navigation";

export default function Layout() {
  redirect("/admin/auth/login");
}
