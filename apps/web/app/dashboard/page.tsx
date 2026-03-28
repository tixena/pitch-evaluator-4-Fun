"use client";

import { Button } from "@workspace/ui/components/button";
import { useSignOut } from "@/hooks/auth";

export default function Page() {
  const { mutate: logout, isPending } = useSignOut();

  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center gap-6 p-6 md:p-10">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <Button
        variant="outline"
        onClick={() => logout()}
        disabled={isPending}
      >
        {isPending ? "Signing out..." : "Sign Out"}
      </Button>
    </div>
  );
}
