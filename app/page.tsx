import WaitListForm from "@/components/waitlist-ui";
import { geistSans } from "@/lib/fonts";
import Link from "next/link";

const page = () => {
  return (
    // TODO: 2. You can now just paste the frontend code here.
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 style={geistSans.style} className="text-3xl font-semibold">
        My Upcoming Billion Dollor Product
      </h1>
      <WaitListForm />
      <Link
        href="https://x.com/ashokasec"
        className="mt-6 font-medium underline"
        style={geistSans.style}
      >
        am here on x
      </Link>
    </main>
  );
};

export default page;
