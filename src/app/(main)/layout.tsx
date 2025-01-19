import { SideBar } from "@/components/sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { UserProvider } from "@/components/providers/user-providers";
import { ExitModal } from "@/components/modal/exit-modal";
import { HeartsModal } from "@/components/modal/hearts-modal";
import { PracticeModal } from "@/components/modal/practice-modal";

type Props = {
  children: React.ReactNode;
};

const MainLayout = async ({ children }: Props) => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <UserProvider user={user}>
      <SideBar className="hidden lg:flex" />
      <ExitModal />
      <HeartsModal />
      <PracticeModal />
      <main className="h-full pt-[50px] lg:pl-[256px] lg:pt-0">
        <div className="mx-auto h-full max-w-[1065px] pt-6">{children}</div>
      </main>
    </UserProvider>
  );
};

export default MainLayout;