import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function AuthForm({
  action,
  children,
  defaultEmail = "",
}: {
  action: any;
  children: React.ReactNode;
  defaultEmail?: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-4 px-4 sm:px-16">
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="email"
          className="text-[#333333] font-normal"
        >
          Email Address
        </Label>

        <Input
          id="email"
          name="email"
          className="bg-[#F5F5F5] text-md md:text-sm border-[#60A2B1] focus:ring-[#60A2B1]"
          type="email"
          placeholder="user@acme.com"
          autoComplete="email"
          required
          defaultValue={defaultEmail}
        />

        <Label
          htmlFor="password"
          className="text-[#333333] font-normal"
        >
          Password
        </Label>

        <Input
          id="password"
          name="password"
          className="bg-[#F5F5F5] text-md md:text-sm border-[#60A2B1] focus:ring-[#60A2B1]"
          type="password"
          required
        />
      </div>

      {children}
    </form>
  );
}