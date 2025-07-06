import WaitListForm from "@/components/waitlist-ui";
import { geistSans } from "@/lib/fonts";

const page = () => {
  return (
    // TODO: 2. You can now just paste the frontend code here.
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 style={geistSans.style} className="text-3xl font-semibold">
        My Upcoming Billion Dollor Product
      </h1>
      <WaitListForm />
    </main>
  );
};

export default page;
