import AuthForm from "@/components/AuthForm";

export default function VaultPage() {
  return (
    <main className="min-h-screen bg-[#adecf5] flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-4xl font-black italic tracking-tighter text-slate-900 uppercase">
        AFK<span className="text-blue-600">PLAY</span> VAULT
      </div>
      
      <AuthForm />
      
      <p className="mt-8 text-slate-600 text-sm font-medium">
        Return to <a href="/" className="underline font-bold hover:text-blue-600 transition-colors">Home</a>
      </p>
    </main>
  );
}