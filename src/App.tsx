// Example usage in a Next.js page (e.g., app/page.tsx)
import { MultiStepForm } from '@/components/MultiStepForm';

export default function HomePage() {
  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl">
        {/* Constrain width */}
        <MultiStepForm />
      </div>
    </main>
  );
}
