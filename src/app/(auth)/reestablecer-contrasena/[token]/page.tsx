import { Metadata } from "next";
import ResetPasswordForm from "../ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reestablecer contraseña",
  description: "Restablece tu contraseña.",
};

type Props = {
  params: Promise<{
    token: string;
  }>;
};

export default async function ResetPasswordPage({ params }: Props) {
  const { token } = await params;

  return (
    <main className="flex h-screen items-center justify-center p-5">
      <ResetPasswordForm token={token} />
    </main>
  );
}
